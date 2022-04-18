const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { serialize } = require("cookie");
require("dotenv").config();

const UserModel = require("../../model/usermodel");

const signup = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Invalid data provided" });
  }

  try {
    const user = await UserModel.create({
      name,
      email,
      password,
    });

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    const serializedCookie = serialize("access", token, {
      httpOnly: true,
      sameSite: "strict",
    });

    res.setHeader("Set-Cookie", serializedCookie);
    return res.status(201).json({ msg: "User registration successful" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error, please try again later" });
  }
};

module.exports = signup;
