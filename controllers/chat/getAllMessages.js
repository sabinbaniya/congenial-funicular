const MessageModel = require("../../model/messagesmodel");

const getAllMessages = async (req, res) => {
  const { chatRoomId } = req.query;

  try {
    const messages = await MessageModel.findOne({ chatRoomId });

    res.send(messages);
  } catch (error) {
    console.log(error);
  }
};
module.exports = getAllMessages;
