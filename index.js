const express = require("express");
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

const authRouter = require("./routes/auth");
const connectDB = require("./db");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authRouter);

app.get("/", (req, res) => {
  res.send("All good");
});

const io = new socketIo.Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

const port = process.env.PORT || 5000;

const start = async () => {
  connectDB();
  server.listen(port, () => console.log(`Server running on port ${port}`));
};

start();
