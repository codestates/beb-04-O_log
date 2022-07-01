require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const onchainRouter = require("./router/onchain/index");
const offchainRouter = require("./router/offchain/index");
const verifyToken = require("./verifyToken");

const app = express();

const { MONGO_URI } = process.env;
const port = process.env.PORT || 8080;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

app.use(
  cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(verifyToken);

//Onchain middlewares
app.use("/onchain", onchainRouter);
//offnchain middlewares
app.use("/offchain", offchainRouter);

app.get("/", (req, res) => {
  res.send("HI");
});
//온체인 오프체인 포트 분리시키기
app.listen(port, () => {
  console.log("Running");
});
