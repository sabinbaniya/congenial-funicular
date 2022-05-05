const cookie = require("cookie");

const logout = async (req, res) => {
  const serializedCookie = cookie.serialize("access", null, {
    httpOnly: true,
    maxAge: -1,
    sameSite: "strict",
    path: "/",
    secure: true,
  });

  res.setHeader("Set-Cookie", serializedCookie);
  return res.status(200).json({ msg: "Successfully logged out" });
};

module.exports = logout;
