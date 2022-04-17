const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

const app = express();

const server = http.createServer(app);

app.get("/", (req, res) => {
  res.send("Hi");
});

const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const port = process.env.PORT || 5000;

server.listen(port, () => console.log(`Server running on port ${port}`));
