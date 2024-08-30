// socket.js
import { io } from "socket.io-client";

let socket;

export const initiateSocketConnection = () => {
  if (!socket) {
    socket = io("http://localhost:5006", {
      withCredentials: true,
    });
    console.log(`User connected: ${socket.id}`);
  }
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) socket.disconnect();
};

export const getSocket = () => {
  return socket;
};
