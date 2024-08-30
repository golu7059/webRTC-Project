// controllers/chat.controller.js
import Chat from '../models/chat.model.js';
import User from '../models/user.model.js';
import AppError from '../utils/error.util.js';

// Send a message
export const sendMessage = async (req, res, next) => {
  const { senderId, receiverId, message, media } = req.body;
  try {
    const chatMessage = await Chat.create({
      sender: senderId,
      receiver: receiverId,
      message,
      media,
    });
    res.status(201).json({
      success: true,
      chatMessage,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};

// Get chat history
export const getChatHistory = async (req, res, next) => {
  const { userId, contactId } = req.params;
  try {
    const chatHistory = await Chat.find({
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      chatHistory,
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
