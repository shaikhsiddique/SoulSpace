const Chat = require("../models/Chat.model");
const UserIssue = require("../models/UserIssue.model");
const userService = require('../service/user.service');
const aiService = require('../service/ai.service');

/**
 * Socket.IO chat handler
 * Handles real-time chat messages via Socket.IO
 */
const socketChatHandler = (socket, io) => {
  socket.on("user_message", async (data) => {
    try {
      const { message } = data;

      if (!message || typeof message !== "string" || message.trim().length === 0) {
        socket.emit("error", { message: "Invalid message" });
        return;
      }

      const user = socket.user;
      if (!user) {
        socket.emit("error", { message: "User not authenticated" });
        return;
      }

      const userdata = await userService.findUserByEmail(user.email);
      if (!userdata) {
        socket.emit("error", { message: "User data not found" });
        return;
      }

      // Track message in session
      socket.sessionMessages.push({
        type: "user",
        content: message,
        timestamp: new Date()
      });

      // Save user message to DB
      const userChat = new Chat({
        userId: userdata._id,
        content: message,
        type: "user",
      });
      await userChat.save();

      // Get recent user issues from DB to provide context
      const recentIssues = await UserIssue.find({ userId: userdata._id })
        .sort({ timestamp: -1 })
        .limit(5)
        .select('summary risk_level topics emotion sentiment')
        .lean();

      // Get recent chat history (last 10-12 messages) for context
      const recentChats = await Chat.find({ userId: userdata._id })
        .sort({ createdAt: -1 })
        .limit(12)
        .lean();

      // Prepare chat history context
      const chatHistory = recentChats.reverse().map(chat => ({
        type: chat.type,
        content: chat.content,
        time: chat.createdAt
      }));

      // Generate chatbot reply with context from stored issues and chat history
      const response = await aiService.generateResult(message, user, recentIssues, chatHistory);

      // Track AI response in session
      socket.sessionMessages.push({
        type: "ai",
        content: response,
        timestamp: new Date()
      });

      // Save AI response to DB
      const aiChat = new Chat({
        userId: userdata._id,
        content: response || "I couldn't generate a response.",
        type: "ai",
      });
      await aiChat.save();

      // Emit AI response back to client
      socket.emit("ai_message", {
        message: response,
        timestamp: new Date()
      });

    } catch (error) {
      console.error("Socket chat handler error:", error);
      socket.emit("error", { message: "Something went wrong processing your message" });
    }
  });

  // Handle typing indicator
  socket.on("typing_start", () => {
    socket.broadcast.emit("user_typing", { userId: socket.user?._id });
  });

  socket.on("typing_stop", () => {
    socket.broadcast.emit("user_typing_stop", { userId: socket.user?._id });
  });
};

module.exports = socketChatHandler;

