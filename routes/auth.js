const router = require("express").Router();
const { body } = require("express-validator");

const { login, signup } = require("../controllers/auth");

router
  .post(
    "/signup",
    body("email").isEmail().normalizeEmail(),
    body("name").not().isEmpty().trim().escape(),
    body("password")
      .not()
      .isEmpty()
      .isLength({ min: 6, max: 20 })
      .trim()
      .escape(),
    signup
  )

  .post(
    "/login",
    body("email").isEmail().normalizeEmail(),
    body("password")
      .not()
      .isEmpty()
      .trim()
      .escape()
      .isLength({ min: 6, max: 20 }),
    login
  );

module.exports = router;
