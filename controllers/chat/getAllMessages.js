const MessageCollectionModel = require("../../model/messagecollectionmodel");

const getAllMessages = async (req, res) => {
  const { chatRoomId } = req.params;
  let { skip } = req.query;
  if (!skip) {
    skip = 0;
  }
  const limit = 10;
  console.log(req.query);

  try {
    const messages = await MessageCollectionModel.findOne(
      {
        roomId: chatRoomId,
      },
      { _id: 0, messageCollectionId: 1, roomId: 1, messageId: 1 }
    ).populate({
      path: "messageId",
      select: "author author_name chatRoomId msg createdAt",
      // options: {
      //   limit,
      //   sort: { createdAt: -1 },
      //   skip: limit * skip,
      // },
    });

    const lengths = await MessageCollectionModel.aggregate([
      {
        $match: { roomId: chatRoomId },
      },
      {
        $project: { NumberOfMessages: { $size: "$messageId" } },
      },
    ]);

    const noOfMessages =
      lengths[0].NumberOfMessages - skip * limit >= 0
        ? lengths[0].NumberOfMessages - skip * limit
        : 0;

    const data = {
      messages: messages._doc,
      noOfMessages,
    };

    console.log(data);
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};
module.exports = getAllMessages;
