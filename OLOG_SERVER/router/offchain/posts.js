const express = require("express");
const posts = express.Router();
const postsController = require("../../controller/offchain/postsController");
const checkLoggedIn = require("../../checkLoggedIn");

posts.route("/").get(postsController.list);

//checkLoggedIn : 로그인 상태일 때만 API를 사용할 수 있도록 함.
posts.route("/").post(checkLoggedIn, postsController.write);
posts.route("/mypage/:username").get(postsController.read);

module.exports = posts;
