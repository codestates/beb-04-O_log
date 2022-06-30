require("dotenv").config();
const mongoose = require("mongoose");
const NFT = require("./models/nft");
const tokenURIs = require("./tokenUri");

const axios = require("axios");
const { MONGO_URI } = process.env;
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

NFTtoDB();

async function NFTtoDB() {
  const arr = tokenURIs.map((el) => {
    let nft = { tokenId: -1, tokenURI: el, sold: false };
    return nft;
  });
  const result = await NFT.insertMany(arr);
  const queryAllNFT = await NFT.find({ sold: false });
  const arr2 = await Promise.all(
    queryAllNFT.map(async (el) => {
      const res = await axios.get(el.tokenURI);
      const metaData = res.data;
      return metaData;
    })
  );

  console.log(arr2);
  process.exit();
}
