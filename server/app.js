import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectionToDB from "./config/databaseConfig.js";

import chatRoute from './routes/chat.route.js'

dotenv.config();

const app = express();
const server = http.createServer(app); // Moved this line up to ensure `server` is defined here
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectionToDB();

// Routes
app.use("/api/chat", chatRoute);

// Socket.io setup
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle sending and receiving messages
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message, media } = data;

    // Save message to the database
    const chatMessage = new Chat({ sender: senderId, receiver: receiverId, message, media });
    await chatMessage.save();

    // Emit the message to the receiver
    io.to(receiverId).emit("getMessage", chatMessage);
  });

  // Handle call events (audio and video)
  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  // Store user ID with socket ID
  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log("Users online:", users);
  });

  // Handle sending and receiving messages
  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message, media } = data;

    // Save message to the database
    const chatMessage = new Chat({ sender: senderId, receiver: receiverId, message, media });
    await chatMessage.save();

    // Emit the message to the receiver
    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", chatMessage);
    }
  });

  socket.on("disconnect", () => {
    // Remove user from online list
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

  export { app, server }; // Export both `app` and `server`
