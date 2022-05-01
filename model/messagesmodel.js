const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    chatroomId: {
      type: String,
      required: true,
    },
    msg: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const MessageModel = mongoose.model("messages", MessageSchema);

module.exports = MessageModel;
