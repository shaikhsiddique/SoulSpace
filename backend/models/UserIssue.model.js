// models/userIssue.model.js

const mongoose = require("mongoose");

const userIssueSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  sentiment: {
    type: String,
    required: true,
  },
  emotion: {
    type: String,
    required: true,
  },
  risk_level: {
    type: String,
    required: true,
  },
  topics: {
    type: [String],
    required: true,
    default: [],
  },
  summary: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const UserIssue = mongoose.model("UserIssue", userIssueSchema);

module.exports = UserIssue;
