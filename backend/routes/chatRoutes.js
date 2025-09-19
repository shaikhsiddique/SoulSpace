import express from "express";
import { getGeminiResponse } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", getGeminiResponse);

export default router;
