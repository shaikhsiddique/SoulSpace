// server.js

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookie_parser = require('cookie-parser');
const dotenv = require("dotenv");
const connectDB = require("./config/db"); // no .js needed in CommonJS
const chatRoutes = require("./routes/chat.routes"); // no .js needed
const userRoutes = require('./routes/user.routes');
const socketAuth = require("./middleware/socketAuth");
const socketChatHandler = require("./sockets/chat.socket");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL || "https://soul-space-nu.vercel.app",
  credentials: true
}));
app.use(cookie_parser())

app.use("/api", chatRoutes);
app.use("/user", userRoutes);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "https://soul-space-nu.vercel.app",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Socket.IO authentication middleware
io.use(socketAuth);

// Socket.IO connection handler
io.on("connection", (socket) => {

  
  // Initialize session message tracking
  socket.sessionMessages = [];
  socket.sessionStartTime = new Date();

  // Handle chat messages
  socketChatHandler(socket, io);

  // Handle disconnect
  socket.on("disconnect", async () => {
    
    
    // Analyze session messages on disconnect
    if (socket.user && socket.sessionMessages && socket.sessionMessages.length > 0) {
      try {
        const analysisService = require("./service/analysis.service");
        const UserIssue = require("./models/userIssue.model");
        const userService = require('./service/user.service');
        
        const userdata = await userService.findUserByEmail(socket.user.email);
        if (userdata) {
          // Extract only user messages from session
          const userMessages = socket.sessionMessages
            .filter(msg => msg.type === "user")
            .map(msg => msg.content)
            .filter(msg => msg && msg.trim().length > 0);

          if (userMessages.length > 0) {
            // Analyze all session messages (from the entire session, not just recent 10-12)
            const analysisResult = await analysisService.analyzeMessages(userMessages);

            // Save analysis result
            const userIssue = new UserIssue({
              userId: userdata._id,
              message: userMessages.join(" "),
              sentiment: analysisResult.sentiment,
              emotion: analysisResult.emotion,
              risk_level: analysisResult.risk_level,
              topics: analysisResult.topics,
              summary: analysisResult.summary,
            });
            await userIssue.save();
            
          }
        }
      } catch (error) {
        console.error("Error analyzing session messages on disconnect:", error.message);
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO server ready`);
});
