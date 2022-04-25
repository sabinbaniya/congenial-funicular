const mongoose = require("mongoose");
const MessageModel = require("./messagesmodel");

const MessageCollectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
  },
  messageId: [{ type: mongoose.Schema.Types.ObjectId, ref: MessageModel }],
});

const MessageCollectionModel = mongoose.model(
  "message_collection",
  MessageCollectionSchema
);

module.exports = MessageCollectionModel;
