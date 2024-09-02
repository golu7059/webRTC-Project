import express from "express";

import cors from "cors";
import dotenv from "dotenv";
import connectionToDB from "./config/databaseConfig.js";

import chatRoute from './routes/chatRoutes.js';
import authRoute from './routes/authRoutes.js';

dotenv.config();

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));

// Connect to MongoDB
connectionToDB();


// Routes
app.use("/api/chat", chatRoute);
app.use("/api/auth", authRoute);

const users = {};

export { app };
