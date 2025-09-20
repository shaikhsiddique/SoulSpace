// models/chat.js

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  message: { type: String, required: true },
  response: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
