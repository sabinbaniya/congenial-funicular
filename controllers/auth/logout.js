const cookie = require("cookie");

const logout = async (req, res) => {
  const serializedCookie = cookie.serialize("access", null, {
    httpOnly: true,
    maxAge: -1,
    sameSite: "strict",
    path: "/",
    secure: true,
  });
  const serializedCookie2 = cookie.serialize("uname", null, {
    httpOnly: false,
    maxAge: -1,
    path: "/",
    secure: true,
  });
  const serializedCookie3 = cookie.serialize("uid", null, {
    httpOnly: false,
    maxAge: -1,
    path: "/",
    secure: true,
  });

  res.setHeader(
    "Set-Cookie",
    serializedCookie,
    serializedCookie2,
    serializedCookie3
  );
  return res.status(200).json({ msg: "Successfully logged out" });
};

module.exports = logout;
