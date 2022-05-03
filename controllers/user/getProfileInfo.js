const { parse } = require("cookie");
const jwt = require("jsonwebtoken");
const UserModel = require("../../model/usermodel");
require("dotenv").config();

const getProfileInfo = async (req, res) => {
  const { access } = parse(req.headers.cookie);

  try {
    const { userId } = jwt.verify(access, process.env.JWT_SECRET);
    const resu = await UserModel.findOne(
      { userId },
      {
        name: 1,
        email: 1,
        avatarUrl: 1,
        onlineStatus: 1,
        isEmailVerified: 1,
        friends: 1,
        createdAt: 1,
      }
    );
    console.log(resu);
    return res.status(200).send(resu);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ msg: "Unauthorized access" });
  }
};

module.exports = getProfileInfo;
