const router = require("express").Router();

const {
  search,
  addFriend,
  getAllFriends,
  getAllMessages,
} = require("../controllers/chat");

router
  .post("/search", search)
  .post("/add", addFriend)
  .get("/getAllFriends", getAllFriends)
  .get("/getAllMessages/:chatRoomId", getAllMessages);

module.exports = router;
