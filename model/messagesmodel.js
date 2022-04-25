const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  author: {
    type: String,
  },
});
