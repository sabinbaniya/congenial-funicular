const { validationResult } = require("express-validator");

const UserModel = require("../../model/usermodel");

const signup = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Invalid data provided" });
  }

  try {
    let alreadyExists = await UserModel.findOne({ email });

    if (alreadyExists) {
      throw new Error("User with given email already exists");
    }

    const user = await UserModel.create({
      name,
      email,
      password,
    });

    const serializedCookie = await user.generateCookie();
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
