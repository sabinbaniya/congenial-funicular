const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");
require("dotenv").config();

const getAllFriends = async (req, res) => {
  const access = req.headers.cookie.split("=")[1];
  const { userId } = jwt.decode(access, process.env.JWT_SECRET);

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

  console.log(friendList);

  res.status(200).json(friendList);
};

module.exports = getAllFriends;
