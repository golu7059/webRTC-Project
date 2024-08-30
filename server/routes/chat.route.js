import express from "express";
import { sendMessage, getChatHistory } from "../controllers/chatController.js";

const router = express.Router();

// Route to send a new message
router.post("/send", sendMessage);

// Route to get chat history between two users
router.get("/history/:userId1/:userId2", getChatHistory);

export default router;
