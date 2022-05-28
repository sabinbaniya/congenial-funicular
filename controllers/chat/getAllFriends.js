const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");
const { parse } = require("cookie");
require("dotenv").config();

const getAllFriends = async (req, res) => {
  let { access, uid, uname } = parse(req.headers.cookie);
  try {
    const { userId, name } = jwt.decode(access);

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

    if (!uid || uid === "null") {
      res.cookie("uid", userId, {
        httpOnly: false,
        path: "/",
        sameSite: "none",
        domain: process.env.URL,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        secure: true,
      });
    }

    if (!uname || uname === "null") {
      res.cookie("uname", name, {
        httpOnly: false,
        path: "/",
        sameSite: "none",
        domain: process.env.URL,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
        secure: true,
      });
    }

    res.status(200).send(friendList);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Bad Request" });
  }
};

module.exports = getAllFriends;
