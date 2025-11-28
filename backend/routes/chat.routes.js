// routes/chatRoutes.js

const express = require("express");
const { getGeminiResponse } = require("../controllers/chat.controller"); // no .js in CommonJS

const router = express.Router();
const auth = require('../middleware/userAuth');

router.post("/chat",auth, getGeminiResponse);

router.post('/savechat',auth,)

module.exports = router;
