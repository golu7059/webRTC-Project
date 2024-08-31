// routes/chat.route.js
import express from 'express';
import { sendMessage, getChatHistory } from '../controllers/chat.controller.js';

const router = express.Router();

router.post('/send', sendMessage);
router.get('/history/:userId/:contactId', getChatHistory);

export default router;
