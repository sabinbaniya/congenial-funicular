const UserModel = require("../../model/usermodel");
const jwt = require("jsonwebtoken");
const { parse } = require("cookie");
const { v4 } = require("uuid");
const MessageCollectionModel = require("../../model/messagecollectionmodel");

require("dotenv").config();

const addFriend = async (req, res) => {
  const { user } = req.body;
  const { access } = parse(req.headers.cookie);

  try {
    const found = await UserModel.findOne({ userId: user });

    const { userId } = jwt.decode(access, process.env.JWT_SECRET);
    const clientUser = await UserModel.findOne({ userId });

    if (!found || !clientUser) {
      return res.status(400).json({ msg: "Couldn't find user" });
    }

    const foundsFriendList = found.friends;

    const areAlreadyFriends = foundsFriendList.some((e, indx) => {
      if (e.userId === clientUser.userId) {
        return true;
      }

      return false;
    });

    if (areAlreadyFriends) {
      return res.status(200).json({ msg: "The users are already friends" });
    }

    const chatRoomId = v4();
    const messageCollectionId = v4();

    await MessageCollectionModel.create({
      messageCollectionId,
      roomId: chatRoomId,
      messageId: [],
    });

    const obj = {
      _id: found._id,
      userId: found.userId,
      name: found.name,
      email: found.email,
      avatarUrl: found.avatarUrl,
      joinedAt: found.createdAt,
      chatRoomId,
      messageCollectionId,
    };

    const obj2 = {
      _id: clientUser._id,
      userId: clientUser.userId,
      name: clientUser.name,
      email: clientUser.email,
      avatarUrl: clientUser.avatarUrl,
      joinedAt: clientUser.createdAt,
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
