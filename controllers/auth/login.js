const UserModel = require("../../model/usermodel");
const { validationResult } = require("express-validator");

const login = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ msg: "Invalid data provided" });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const doPasswordsMatch = await user.comparePasswords(password);

    if (!doPasswordsMatch) {
      return res.status(401).json({ msg: "Invalid Credentials" });
    }

    const serializedCookie = await user.generateCookie();

    res.setHeader("Set-Cookie", serializedCookie);
    return res.status(200).json({ msg: "User login successful" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal Server Error." });
  }
};

module.exports = login;
