import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectionToDB from "./config/databaseConfig.js";

import chatRoute from './routes/chatRoutes.js';
import authRoute from './routes/authRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectionToDB();

// Routes
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);

const users = {};

// Socket.io setup
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    users[userId] = socket.id;
    console.log("Users online:", users);
  });

  socket.on("sendMessage", async (data) => {
    const { senderId, receiverId, message, media } = data;

    const chatMessage = new Chat({ sender: senderId, receiver: receiverId, message, media });
    await chatMessage.save();

    const receiverSocketId = users[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("getMessage", chatMessage);
    }
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(users[userToCall]).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(users[data.to]).emit("callAccepted", data.signal);
  });

  socket.on("disconnect", () => {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { app, server };
