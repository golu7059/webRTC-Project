import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import connectionToDB from "./config/databaseConfig.js";

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

// Socket.io setup
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  // Add event listeners for chat, video call, etc.

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

export { app, server }; // Export both `app` and `server`
