const MessageCollectionModel = require("../../model/messagecollectionmodel");
const { parse } = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");

const getAllMessages = async (req, res) => {
  const { chatRoomId } = req.params;
  const { access } = parse(req.headers.cookie);
  const { userId } = jwt.decode(access);
  let { skip } = req.query || 0;
  const limit = 50;

  try {
    const a = await UserModel.findOne({ userId }, { friends: 1 });
    const hasPerms = a.friends.some(
      (friend) => friend.chatRoomId === chatRoomId
    );

    if (!hasPerms) {
      return res.status(400).json({ msg: "Unauthorized Access" });
    }

    const messages = await MessageCollectionModel.findOne(
      {
        roomId: chatRoomId,
      },
      { _id: 0, messageCollectionId: 1, roomId: 1, messageId: 1 }
    ).populate({
      path: "messageId",
      select: "_id author author_name chatRoomId msg createdAt",
      options: {
        limit,
        sort: { createdAt: -1 },
        skip: limit * skip,
      },
    });

    // const lengths = await MessageCollectionModel.aggregate([
    //   {
    //     $match: { roomId: chatRoomId },
    //   },
    //   {
    //     $project: { NumberOfMessages: { $size: "$messageId" } },
    //   },
    // ]);

    // const noOfMessages =
    //   lengths[0].NumberOfMessages - skip * limit >= 0
    //     ? lengths[0].NumberOfMessages - skip * limit
    //     : 0;

    const data = {
      messages: messages._doc,
      // noOfMessages,
    };

    res.status(200).send(data);
  } catch (error) {
    console.log(error);
  }
};
module.exports = getAllMessages;
