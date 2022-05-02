const MessageCollectionModel = require("../../model/messagecollectionmodel");

const getAllMessages = async (req, res) => {
  const { chatRoomId } = req.params;

  try {
    const messages = await MessageCollectionModel.findOne(
      {
        roomId: chatRoomId,
      },
      { _id: 0, messageCollectionId: 1, roomId: 1, messageId: 1 }
    ).populate("messageId", {
      _id: 0,
      author: 1,
      chatRoomId: 1,
      msg: 1,
      createdAt: 1,
    });

    console.log(messages);
    res.send(messages);
  } catch (error) {
    console.log(error);
  }
};
module.exports = getAllMessages;
