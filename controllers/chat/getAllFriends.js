const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");
require("dotenv").config();

const getAllFriends = async (req, res) => {
  const access = req.headers.cookie.split("=")[1];
  const { userId } = jwt.decode(access, process.env.JWT_SECRET);

  const user = await UserModel.findOne({ userId });

  const friendList = await Promise.all(
    user.friends.map(async (friend) => {
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

  console.log(friendList);

  res.send(friendList);
};

module.exports = getAllFriends;
