const UserModel = require("../../model/usermodel");

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    const doPasswordsMatch = await user.comparePasswords(password);

    if (!doPasswordsMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
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
