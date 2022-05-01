const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const connectDB = require("./db");
const MessageModel = require("./model/messagesmodel");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.send("All good");
});

const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
  cookie: true,
});

io.on("connection", (socket) => {
  console.log(socket);
  socket.on("join_room", (data) => {
    console.log(data);
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    console.log(data);

    const message = {
      author: data.author,
      chatRoomId: data.chatRoomId,
      msg: data.msg,
    };

    const res = await MessageModel.create(message);
    console.log(res);

    socket.emit("get_message", data.msg);
  });
});

const port = process.env.PORT || 5000;

const start = async () => {
  connectDB();
  server.listen(port, () => console.log(`Server running on port ${port}`));
};

start();
