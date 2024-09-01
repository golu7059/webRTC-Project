import io from 'socket-io'
import app from '../app'
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

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
  
export default io;