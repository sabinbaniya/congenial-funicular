const UserModel = require("../../model/usermodel");

const search = async (req, res) => {
  const { email } = req.body;

  try {
    const users = await UserModel.find({ email });

    const user = {
      name: users[0].name,
      avatarUrl: users[0].avatarUrl,
      joinedAt: users[0].createdAt,
      userId: users[0].userId,
    };

    res.json({ user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = search;
