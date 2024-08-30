import Chat from "../models/chat.model.js";
import AppError from "../utils/error.util.js";

// Send a new message
export const sendMessage = async (req, res, next) => {
    const { senderId, receiverId, message } = req.body;
  
    if (!senderId || !receiverId || (!message && !req.file)) {
      return next(new AppError("All fields are required!", 400));
    }
  
    try {
      let mediaUrl;
      if (req.file) {
        mediaUrl = req.file.path;
      }
  
      const chat = new Chat({
        sender: senderId,
        receiver: receiverId,
        message,
        media: mediaUrl,
      });
  
      await chat.save();
  
      res.status(201).json({
        success: true,
        message: "Message sent successfully",
        chat,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  };
  

// Fetch chat history between two users
export const getChatHistory = async (req, res, next) => {
  const { userId1, userId2 } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json({
      success: true,
      chatHistory,
    });
  } catch (error) {
   return next(new AppError(error.message, 500));
  }
};
