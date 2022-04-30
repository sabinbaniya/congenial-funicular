const router = require("express").Router();

const { search, addFriend, getAllFriends } = require("../controllers/chat");

router
  .post("/search", search)
  .post("/add", addFriend)
  .get("/getAllFriends", getAllFriends);

module.exports = router;
