const UserModel = require("../../model/usermodel");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const MessageCollectionModel = require("../../model/messagecollectionmodel");

require("dotenv").config();

const addFriend = async (req, res) => {
  const { user } = req.body;
  const access = req.headers.cookie.split("=")[1];

  try {
    const found = await UserModel.findOne({ userId: user });

    const { userId } = jwt.decode(access, process.env.JWT_SECRET);
    const clientUser = await UserModel.findOne({ userId });

    if (!found || !clientUser) {
      return res.status(400).json({ msg: "Couldn't find user" });
    }

    const chatRoomId = v4();
    const messageCollectionId = v4();

    await MessageCollectionModel.create({
      messageCollectionId,
      roomId: chatRoomId,
      messageId: [],
    });

    const obj = {
      userId: found.userId,
      chatRoomId,
      messageCollectionId,
    };

    const obj2 = {
      userId: clientUser.userId,
      chatRoomId,
      messageCollectionId,
    };

    await UserModel.findOneAndUpdate({ userId }, { $push: { friends: obj } });

    await UserModel.findOneAndUpdate(
      { userId: user },
      { $push: { friends: obj2 } }
    );

    /*
    to-do

    check if a user is trying to friend themselve
    check if a user is trying to friend an already friended user
    
    */

    /* after finding user, take its Userid, create a object with fields {
            friends: ObjectId,
            chatRoomId: generate a uuid for their chatroom,
            messageCollectionId: generate a message collection and insert its id
        }

        after updating clientUser's friends array do the same with user's friends array

        */

    return res.status(200).json({ msg: "Successfully added friend" });
  } catch (error) {
    console.log(error);
  }
};

module.exports = addFriend;
