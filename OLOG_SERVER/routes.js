const express = require("express");
const router = express.Router();
const Post = require("../../models/test");

router.get("/", (req, res) => {
  res.send("GET 요청을 수신했습니다.");
});

router.post("/", (req, res) => {
  res.send("POST 요청을 수신했습니다.");
});

router.patch("/:id", (req, res) => {
  res.send("PATCH 요청을 수신했습니다.");
});

router.delete("/:id", (req, res) => {
  res.send("DELETE 요청을 수신했습니다.");
});

module.exports = router;
