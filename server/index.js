import express from "express"
import http from "http"
import { Server } from "socket.io"

const PORT = process.env.PORT || 5065;

const app = express();

const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

io.on('connection', (socket) => {
    console.log(`user connected : ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`user is disconncted : ${socket.id}`);
    });

    socket.on('message', (data) => {
        console.log(`${socket.id} sends : ${data}`);
        io.emmit('message', data); // Broadcast the message to all clients
    });
    
});

server.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
}).on("error", (e) => {
    if (e.code == "EADDRINUSE") {
        console.log("Port already in use");
    } else {
        console.log(e)
    }
})

