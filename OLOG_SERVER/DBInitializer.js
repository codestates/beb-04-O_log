require("dotenv").config();
const mongoose = require("mongoose");
const {
  USER_ADDRESS,
  USER_PRIVATE_KEY,
  SERVER_ADDRESS,
  SERVER_PRIVATE_KEY,
  MONGO_URI,
} = process.env;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

const User = require("./models/user");
const NFT = require("./models/nft");

dbInitializer();

async function dbInitializer() {
  await User.findOneAndUpdate(
    { username: "server" },
    {
      address: SERVER_ADDRESS,
      privateKey: SERVER_PRIVATE_KEY,
      receivedToken: 0,
      expectedToken: 0,
      NFTPossessed: [],
    }
  );
  await User.findOneAndUpdate(
    { username: "user" },
    {
      address: USER_ADDRESS,
      privateKey: USER_PRIVATE_KEY,
      receivedToken: 0,
      expectedToken: 0,
      NFTPossessed: [],
    }
  );
  await NFT.findOneAndUpdate(
    { tokenURI: "AAA" },
    { tokenId: -1, NFTrewardFactor: 1 }
  );
  process.exit();
}
