const UserModel = require("../../model/usermodel");
const { validationResult } = require("express-validator");
const { parse } = require("cookie");
const jwt = require("jsonwebtoken");

const search = async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  const { access } = parse(req.headers.cookie);

  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Invalid data provided" });
  }

  try {
    const users = await UserModel.findOne({ email, isEmailVerified: true });
    if (!users) {
      return res.status(200).json({ msg: "No users found" });
    }
    const { userId } = jwt.decode(access);
    const self = await UserModel.findOne({ userId });

    let areAlreadyFriends = users.friends.filter(
      (friend) => friend.userId === userId
    );

    const isSelf = self.email === email;

    const chatRoomId =
      areAlreadyFriends.length !== 0 ? areAlreadyFriends[0].chatRoomId : null;

    const user = {
      name: users.name,
      avatarUrl: users.avatarUrl,
      joinedAt: users.createdAt,
      userId: users.userId,
      areAlreadyFriends: areAlreadyFriends.length !== 0,
      chatRoomId,
      isSelf: false,
    };

    if (isSelf) {
      user.isSelf = true;
      return res.status(200).json({ user });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = search;
