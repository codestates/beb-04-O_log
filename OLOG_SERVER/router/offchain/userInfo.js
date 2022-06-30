const express = require("express");
const userInfo = express.Router();
const userinfoController = require("../../controller/offchain/userinfoController");

userInfo.route("/status").get(userinfoController.status);
userInfo.route("/comment/:username").get(userinfoController.read);
userInfo.route("/comment/:username").post(userinfoController.write);

module.exports = userInfo;
