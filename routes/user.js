const router = require("express").Router();

const getProfileInfo = require("../controllers/user/getProfileInfo");

router.get("/getProfileInfo", getProfileInfo);

module.exports = router;
