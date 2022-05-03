const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/user");
const connectDB = require("./db");
const MessageModel = require("./model/messagesmodel");
const MessageCollectionModel = require("./model/messagecollectionmodel");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);

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
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", async (data) => {
    try {
      const message = {
        author: data.author,
        author_name: data.author_name,
        chatRoomId: data.chatRoomId,
        msg: data.msg,
        createdAt: Date.now(),
      };

      const res = await MessageModel.create(message);
      await MessageCollectionModel.findOneAndUpdate(
        { roomId: message.chatRoomId },
        { $push: { messageId: res._id } }
      );

      io.in(data.chatRoomId).emit("get_message", message);
    } catch (error) {
      console.log(error);
    }
  });
});

const port = process.env.PORT || 5000;

const start = async () => {
  connectDB();
  server.listen(port, () => console.log(`Server running on port ${port}`));
};

start();
