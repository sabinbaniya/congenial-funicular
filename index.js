const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const rateLimiter = require("express-rate-limit");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

const authRouter = require("./routes/auth");
const chatRouter = require("./routes/chat");
const userRouter = require("./routes/user");
const connectDB = require("./db");
const MessageModel = require("./model/messagesmodel");
const MessageCollectionModel = require("./model/messagecollectionmodel");
const authChecker = require("./middlewares/authchecker");
const UserModel = require("./model/usermodel");

const URL = process.env.URL;

app.use(
  cors({
    origin: URL,
    credentials: true,
    withCredentials: true,
  })
);

app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(express.json());
app.use(helmet());

app.use("/api/auth", authRouter);

app.use("/api/chat", authChecker, chatRouter);
app.use("/api/user", authChecker, userRouter);

app.get("/", (req, res) => {
  res.send("All good");
});

const io = new socketIo.Server(server, {
  cors: {
    origin: URL,
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

      io.to(data.chatRoomId).emit("get_message", message);
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on("set_online", async ({ status, userId }) => {
  //   try {
  //     const user = await UserModel.findOneAndUpdate(
  //       { userId },
  //       { onlineStatus: status }
  //     );
  //     console.log(status);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // socket.on("disconnect", (data) => {
  //   // console.log(data);
  // });
});

const port = process.env.PORT || 5000;

const start = async () => {
  connectDB();
  server.listen(port, () => console.log(`Server running on port ${port}`));
};

start();
