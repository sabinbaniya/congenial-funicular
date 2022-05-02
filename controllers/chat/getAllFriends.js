const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");
require("dotenv").config();

const getAllFriends = async (req, res) => {
  let access = req.headers.cookie.split("=")[1];
  access = access.split(";")[0];
  let userId;
  try {
    userId = jwt.decode(access).userId;
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Bad Request" });
  }

  const user = await UserModel.findOne({ userId });

  const chatRooms = user.friends;

  let friendList = await Promise.all(
    user.friends.map(async (friend, ind) => {
      return await UserModel.findOne({ userId: friend.userId }).select({
        _id: 0,
        avatarUrl: 1,
        email: 1,
        name: 1,
        onlineStatus: 1,
        userId: 1,
      });
    })
  );

  friendList = friendList.map((friend, ind) => {
    return {
      ...friend,
      chatRoomId: chatRooms[ind].chatRoomId,
    };
  });

  res.status(200).json(friendList);
};

module.exports = getAllFriends;
