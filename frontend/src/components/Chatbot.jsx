import { useState, useRef, useEffect } from "react";
import { createSocketConnection } from "../config/socket";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoSend } from "react-icons/io5";
import { motion } from "framer-motion";


function Chatbot() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const chatContainerRef = useRef(null);
  const socketRef = useRef(null);
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

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-[#C6E2E9] to-[#F7F8FC] p-10">
      <motion.div
        className="w-full max-w-2xl bg-white shadow-xl rounded-xl p-6 flex flex-col"
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
          className="h-[450px] bg-gray-100 rounded-lg p-4 overflow-y-auto"
        >
          {chat.map((msg, index) => (
            <motion.div
              key={index}
              className={`p-3 my-2 rounded-lg max-w-[75%] ${
                msg.sender === "user"
                  ? "bg-[#3B3B98] text-white ml-auto"
                  : "bg-gray-200 text-gray-800 mr-auto"
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
              className="p-3 my-2 rounded-lg bg-gray-300 text-gray-700 max-w-[75%] mr-auto"
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
          <button
            className="p-2 bg-[#3B3B98] text-white rounded-full hover:bg-[#2F2F89] transition-all"
            onClick={handleSendMessage}
            disabled={loading}
          >
            <IoSend />
          </button>
        </motion.div>

        <ToastContainer position="top-right" autoClose={3000} />
      </motion.div>
    </div>
  );
}

export default Chatbot;
