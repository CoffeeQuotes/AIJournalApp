const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }
});

app.use(cors());

io.on("connection", (socket) => {
  console.log("New client connected" + socket.id);
  socket.on("general-notification", (data) => {
    console.log("general-notification: " + data);
    io.emit("general-notification", data);
  });  
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

server.listen(8080, () => console.log("Server started on port 8080"));