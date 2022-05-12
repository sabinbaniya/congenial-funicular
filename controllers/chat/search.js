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
    const users = await UserModel.find({ email });
    const { userId } = jwt.decode(access);
    let areAlreadyFriends = users[0].friends.filter(
      (friend) => friend.userId === userId
    );

    const user = {
      name: users[0].name,
      avatarUrl: users[0].avatarUrl,
      joinedAt: users[0].createdAt,
      userId: users[0].userId,
      areAlreadyFriends: areAlreadyFriends.length !== 0,
    };

    res.json({ user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = search;
