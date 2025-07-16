const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = new Server(server, {
cors: { origin: "*", methods: ["GET", "POST"] }
});

// Message history stored in memory
const messageHistory = [];

io.on("connection", (socket) => {
console.log("User connected:", socket.id);

// Send message history to new user
socket.emit("message history", messageHistory);

socket.on("chat message", ({ user, message }) => {
const msgData = {
user,
message,
time: new Date().toLocaleTimeString()
};
messageHistory.push(msgData); // Save to history
io.emit("chat message", msgData); // Send to everyone
});

socket.on("typing", (name) => {
socket.broadcast.emit("typing", name);
});

socket.on("stop typing", () => {
socket.broadcast.emit("stop typing");
});

socket.on("disconnect", () => {
console.log("User disconnected:", socket.id);
});
});

server.listen(5000, () => console.log("Server running on http://localhost:5000"));
