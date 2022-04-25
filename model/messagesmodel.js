const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      required: true,
    },
    recieverChatroomId: {
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
