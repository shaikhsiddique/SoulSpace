import axios from "axios";
import Chat from "../models/Chat.js";

const MODEL_NAME = "gemini-1.5-pro"

export const getGeminiResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "API key is missing" });
    }

    const MODEL_NAME = "gemini-1.5-pro"; // Replace this with your valid model

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }]
      }
    );

    const reply =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't generate a response.";

    // Save chat to DB
    const chat = new Chat({ message, response: reply });
    await chat.save();

    res.json({ message, reply });
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
