const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");
const { parse } = require("cookie");
require("dotenv").config();

const getAllFriends = async (req, res) => {
  let { access } = parse(req.headers.cookie);
  try {
    const { userId } = jwt.decode(access);

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
        friend: friend._doc,
        chatRoomId: chatRooms[ind].chatRoomId,
      };
    });

    res.status(200).send(friendList);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Bad Request" });
  }
};

module.exports = getAllFriends;
