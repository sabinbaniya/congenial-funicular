const { parse } = require("cookie");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authChecker = (req, res, next) => {
  try {
    if (!req.headers.cookie)
      return res.status(401).json({ msg: "Unauthorised req" });

    const { access } = parse(req.headers.cookie);
    if (!access) {
      return res.status(401).json({ msg: "Unauthorised req" });
    }
    jwt.verify(access, process.env.JWT_SECRET);

    return next();
  } catch (error) {
    return res.status(401).json({ msg: "Unauthorised req" });
  }
};

module.exports = authChecker;
