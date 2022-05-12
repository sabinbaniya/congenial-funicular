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
  .post("/add", addFriend)
  .get("/getAllFriends", getAllFriends)
  .get("/getAllMessages/:chatRoomId", getAllMessages);

module.exports = router;
