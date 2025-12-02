import { useState, useRef, useEffect } from "react";
import { createSocketConnection } from "../config/socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSend, IoVolumeHigh } from "react-icons/io5";
import { motion } from "framer-motion";


function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const femaleVoiceRef = useRef(null);
  const token = localStorage.getItem("Auth-Token");

  // Initialize Socket.IO connection when component mounts
  useEffect(() => {
    if (!token) {
      toast.error("Please login to use the chatbot.");
      return;
    }

    // Create socket connection
    const socket = createSocketConnection(token);
    socketRef.current = socket;

    // Handle connection events
    socket.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      toast.success("Connected to chatbot");
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
      toast.warning("Disconnected from chatbot");
    });

    socket.on("connect_error", (error) => {
      console.error("Connection error:", error);
      setIsConnected(false);
      toast.error(error.message || "Failed to connect to chatbot");
    });

    // Handle AI message response
    socket.on("ai_message", (data) => {
      const botResponse = { text: data.message, sender: "bot" };
      setChat((prevChat) => [...prevChat, botResponse]);
      setLoading(false);
    });

    // Handle errors
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(error.message || "An error occurred");
      setLoading(false);
    });

    // Cleanup: disconnect socket when component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  const handleSendMessage = () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    if (!isConnected || !socketRef.current) {
      toast.error("Not connected to chatbot. Please wait...");
      return;
    }

    const userMessage = { text: message, sender: "user" };
    setChat((prevChat) => [...prevChat, userMessage]);
    const messageToSend = message;
    setMessage("");
    setLoading(true);

    // Send message via socket
    socketRef.current.emit("user_message", { message: messageToSend });
  };

  useEffect(() => {
    chatContainerRef.current?.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chat]);

  const handleSpeak = () => {
    // Find the last bot message
    const lastBotMessage = [...chat].reverse().find((msg) => msg.sender === "bot");
    
    if (!lastBotMessage || !lastBotMessage.text) {
      toast.error("No bot message to speak.");
      return;
    }

    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      window.speechSynthesis.cancel();
    }

    // Check if browser supports speech synthesis
    if (!("speechSynthesis" in window)) {
      toast.error("Your browser does not support text-to-speech.");
      return;
    }

    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(lastBotMessage.text);
    utterance.rate = 0.9;
    utterance.pitch = 1.8;
    utterance.volume = 1.0;
    
    // Set female voice if available
    if (femaleVoiceRef.current) {
      utterance.voice = femaleVoiceRef.current;
    } else {
      // Try to get female voice again if not set
      const voices = window.speechSynthesis.getVoices();
      const femaleVoice = voices.find(voice => 
        voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("hazel") ||
        voice.name.toLowerCase().includes("samantha")
      );
      if (femaleVoice) {
        utterance.voice = femaleVoice;
        femaleVoiceRef.current = femaleVoice;
      }
    }

    utterance.onend = () => {
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
    };

    utterance.onerror = (error) => {
      console.error("Speech synthesis error:", error);
      setIsSpeaking(false);
      speechSynthesisRef.current = null;
      toast.error("Failed to speak message.");
    };

    speechSynthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Get female voice on component mount
  useEffect(() => {
    const getFemaleVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      
      // Common female voice names across different browsers/OS
      const femaleVoiceNames = [
        "Zira", "Hazel", // Windows
        "Samantha", "Victoria", "Karen", "Fiona", "Tessa", // macOS
        "Google UK English Female", "Microsoft Zira - English (United States)",
        "Microsoft Hazel - English (Great Britain)", "Google US English Female"
      ];
      
      // Try to find a voice by name first
      let femaleVoice = voices.find(voice => 
        femaleVoiceNames.some(name => 
          voice.name.toLowerCase().includes(name.toLowerCase())
        )
      );
      
      // If not found by name, try to find by checking if voice name contains "female"
      if (!femaleVoice) {
        femaleVoice = voices.find(voice => 
          voice.name.toLowerCase().includes("google uk english female")
        );
      }
      
      // If still not found, try voices that are typically female (checking common patterns)
      if (!femaleVoice) {
        femaleVoice = voices.find(voice => {
          const name = voice.name.toLowerCase();
          return name.includes("zira") || name.includes("hazel") || 
                 name.includes("samantha") || name.includes("victoria") ||
                 name.includes("karen") || name.includes("fiona");
        });
      }
      
      // Fallback: use the first available voice if no female voice found
      femaleVoiceRef.current = femaleVoice || voices[0] || null;
    };

    // Voices may not be loaded immediately, so we need to wait for them
    if (window.speechSynthesis.getVoices().length > 0) {
      getFemaleVoice();
    } else {
      // Wait for voices to be loaded
      window.speechSynthesis.onvoiceschanged = getFemaleVoice;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC] p-10">
      <motion.div
        className="w-full mx-24 bg-white shadow-xl rounded-xl p-6 flex flex-col"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-4">
          <motion.h1
            className="text-3xl font-bold text-[#3B3B98] text-center flex-1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            SoulSpace Chatbot
          </motion.h1>
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span className="text-sm text-gray-600">
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="h-[450px] bg-gray-100 rounded-lg p-4 overflow-y-auto flex flex-col"
        >
          {chat.map((msg, index) => (
            <motion.div
              key={index}
              className={`px-4 py-3 my-1 rounded-2xl shadow-sm break-words w-fit max-w-[85%] ${
                msg.sender === "user"
                  ? "bg-[#3B3B98] text-white ml-auto text-right self-end"
                  : "bg-gray-200 text-gray-800 mr-auto text-left self-start"
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {msg.text}
            </motion.div>
          ))}

          {loading && (
            <motion.div
              className="px-4 py-3 my-2 rounded-2xl bg-gray-300 text-gray-700 w-fit max-w-[85%] mr-auto self-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              typing...
            </motion.div>
          )}
        </div>

        {/* Input Field & Send Button */}
        <motion.div
          className="w-full flex mt-3 bg-white rounded-lg border p-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <input
            type="text"
            className="flex-1 p-2 border-none bg-transparent outline-none text-gray-700"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <div className="flex gap-2">
            <button
              className={`p-2 rounded-full transition-all ${
                isSpeaking
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              onClick={handleSpeak}
              title="Speak last bot message"
              disabled={chat.filter((msg) => msg.sender === "bot").length === 0}
            >
              <IoVolumeHigh />
            </button>
            <button
              className="p-2 bg-[#3B3B98] text-white rounded-full hover:bg-[#2F2F89] transition-all"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <IoSend />
            </button>
          </div>
        </motion.div>

        <ToastContainer position="top-right" autoClose={3000} />
      </motion.div>
    </div>
  );
}

export default Chatbot;
