const express = require("express");
const posts = require("./posts");
const auth = require("./auth");
const nftmarket = require("./nftmarket");
const userInfo = require("./userInfo");
const router = express.Router();

router.use("/posts", posts);
router.use("/auth", auth);
router.use("/nftmarket", nftmarket);
router.use("/userInfo", userInfo);
module.exports = router;
