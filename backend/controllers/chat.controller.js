// controllers/chatController.js

const Chat = require("../models/Chat.model"); // CommonJS import, no .js
const UserIssue = require("../models/userIssue.model");
const userService = require('../service/user.service');
const aiService = require('../service/ai.service');
const analysisService = require('../service/analysis.service');

const getGeminiResponse = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userdata = await userService.findUserByEmail(user.email);
    
    if (!userdata) {
      return res.status(404).json({ error: 'User data not found' });
    }
    
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

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

    // 1. Generate chatbot reply with context from stored issues and chat history
    const response = await aiService.generateResult(message, user, recentIssues, chatHistory);

    // Save AI response to DB
    const aiChat = new Chat({
      userId: userdata._id,
      content: response || "I couldn't generate a response.",
      type: "ai",
    });
    await aiChat.save();

    // 2. Get recent 10-12 user messages for analysis
    const recentUserMessages = await Chat.find({
      userId: userdata._id,
      type: "user"
    })
      .sort({ createdAt: -1 })
      .limit(12)
      .select('content')
      .lean();

    // Extract message content
    const messagesToAnalyze = recentUserMessages
      .reverse()
      .map(chat => chat.content)
      .filter(msg => msg && msg.trim().length > 0);

    // 3. Analyze recent user messages (10-12 messages)
    if (messagesToAnalyze.length > 0) {
      try {
        const analysisResult = await analysisService.analyzeMessages(messagesToAnalyze);

        // 4. Save analysis result in DB under user_issues collection
        const userIssue = new UserIssue({
          userId: userdata._id,
          message: messagesToAnalyze.join(" "), // Store combined context
          sentiment: analysisResult.sentiment,
          emotion: analysisResult.emotion,
          risk_level: analysisResult.risk_level,
          topics: analysisResult.topics,
          summary: analysisResult.summary,
        });
        await userIssue.save();
      } catch (analysisError) {
        // Log analysis error but don't fail the request
        console.error("Analysis error:", analysisError.message);
      }
    }

    // 5. Return chatbot reply only
    res.json({ message, response });
  } catch (error) {
    console.error("Chat controller error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const saveChatController = async (req,res) =>{
  
}

module.exports = { getGeminiResponse };
