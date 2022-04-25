const router = require("express").Router();

const { search, addFriend } = require("../controllers/chat");

router.post("/search", search).post("/add", addFriend);

module.exports = router;
