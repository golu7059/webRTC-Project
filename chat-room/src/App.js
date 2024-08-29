import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { Button, Container, TextField, Typography } from "@mui/material";

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State to hold received messages
  const socketRef = useRef();

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io("http://localhost:5065");

    // Log connection
    socketRef.current.on("connect", () => {
      console.log("Connected");
    });

    // Listen for incoming messages
    socketRef.current.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]); // Append new message to messages array
      console.log(data); // Log the message
    });

    // Clean up on component unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  const sendMessage = (e) => {
    e.preventDefault();
    socketRef.current.emit("message", message); // Emit message to server
    setMessage(""); // Clear input field
  };

  return (
    <div>
      <Container maxWidth="sm">
        <Typography variant="h1" component="div" gutterBottom>
          Chat Room
        </Typography>

        {/* Display received messages */}
        <div>
          {messages.map((msg, index) => (
            <Typography key={index} variant="body1">
              {msg}
            </Typography>
          ))}
        </div>

        <form onSubmit={sendMessage}>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            id="outlined-basics"
            label="Message"
            variant="outlined"
            fullWidth
          />

          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
      </Container>
    </div>
  );
}

export default App;
