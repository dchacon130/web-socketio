const express = require("express");
const path = require("path");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { instrument } = require("@socket.io/admin-ui");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
      origin: ['https://admin.socket.io'],
      credentials: true
    }
  });

instrument(io, {
    auth: {
        type: 'basic',
        username: 'admin',
        password: '$2a$12$i.boppxUFb7M7hectbLqq.Xr4xZftJ41hyKwa3JWslFlMKwk6Pkpa'
    }
})

app.use( express.static(path.join(__dirname, "views")) );

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

io.on("connection", socket => {
    socket.on('circle position', position => {
        socket.broadcast.emit('move circle', position);
    });
});

httpServer.listen(3000);