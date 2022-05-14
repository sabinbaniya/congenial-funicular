const { validationResult } = require("express-validator");
const { v4 } = require("uuid");
const sendMail = require("../../helpers/sendMail");
const UserModel = require("../../model/usermodel");

const signup = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Invalid data provided" });
  }

  try {
    let alreadyExists = await UserModel.findOne({ email });

    const userId = v4();
    const emailVerificationToken = v4();

    if (alreadyExists) {
      return res.status(400).json({ msg: "User registeration failed" });
    }

    const user = await UserModel.create({
      userId,
      name,
      email,
      password,
      emailVerificationToken,
    });

    const mailSent = await sendMail(email, emailVerificationToken);

    if (mailSent) {
      return res.status(201).json({ msg: "User registration successful" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error, please try again later" });
  }
};

module.exports = signup;
