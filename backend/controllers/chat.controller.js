// controllers/chatController.js

const axios = require("axios");
const Chat = require("../models/Chat.model"); // CommonJS import, no .js
const userService = require('../service/user.service');
const aiService = require('../service/ai.service');

const getGeminiResponse = async (req, res) => {
  try {
    const user = req.user;

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userdata = await userService.findUserByEmail(user.email);
        
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    

    // API request to Gemini
    const response = await aiService.generateResult(message,user);
    


    // Save chat to DB
    const chat = new Chat({ message, response: response || "I couldn't generate a response."});
    await chat.save();

    res.json({ message, response });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = { getGeminiResponse };
