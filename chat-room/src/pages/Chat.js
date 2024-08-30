import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import io from "socket.io-client";
import { Container, TextField, Button, List, ListItem, Typography } from "@mui/material";
import Dropzone from "react-dropzone";
import axios from "../utils/axiosConfig";
import { initiateSocketConnection, disconnectSocket } from "../utils/socket";

const socket = io("http://localhost:5006");

const Chat = () => {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    socket.on("getMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("getMessage");
    };
  }, []);

  useEffect(() => {
    initiateSocketConnection();
  
    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSendMessage = () => {
    const data = {
      senderId: user._id,
      message,
      media: files,
    };
    socket.emit("sendMessage", data);
    setMessage("");
    setFiles([]);
  };

  const handleFileUpload = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  return (
    <Container>
      <Typography variant="h4">Chat Room</Typography>
      <List>
        {messages.map((msg, index) => (
          <ListItem key={index}>{msg.message}</ListItem>
        ))}
      </List>
      <TextField
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        fullWidth
        placeholder="Type your message..."
      />
      <Dropzone onDrop={handleFileUpload}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <Button variant="outlined">Upload Files</Button>
          </div>
        )}
      </Dropzone>
      <Button variant="contained" onClick={handleSendMessage}>
        Send
      </Button>
    </Container>
  );
};

export default Chat;
