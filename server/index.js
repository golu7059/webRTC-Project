const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();

// make server using http 
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 5065;

// to use static files like html files and we are usign path module so it should be resolved
app.use(express.static(path.resolve('./public')));

app.get('/', (req, res) => {
    res.sendFile('./public/index.html')
})

// socket.io connection 
io.on('connection', (socket) => { // socket is basically client information / data
    socket.on("chat-message",(message) => {
        console.log(`sockedt id ${socket.id} send : `,message);
        io.emit('server-message',message);
    })
})

server.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`)
}).on("error", (e) => {
    if (e.code == "EADDRINUSE") {
        console.log("Port already in use");
    } else {
        console.log(e)
    }
})
