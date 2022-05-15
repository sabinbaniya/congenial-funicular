const router = require("express").Router();
const { body } = require("express-validator");

const {
  search,
  addFriend,
  getAllFriends,
  getAllMessages,
} = require("../controllers/chat");

router
  .post("/search", body("email").isEmail().normalizeEmail(), search)
  .post(
    "/add",
    body("user").not().isEmpty().trim().escape().isLength({ min: 2, max: 30 }),
    addFriend
  )
  .get("/getAllFriends", getAllFriends)
  .get("/getAllMessages/:chatRoomId", getAllMessages);

module.exports = router;
