const express = require("express");
const nftmarket = express.Router();
const marketplaceController = require("../../controller/offchain/marketplaceController");

nftmarket.route("/myNFT").get(marketplaceController.myNFT);
nftmarket.route("/allNFT").get(marketplaceController.queryNFT);

module.exports = nftmarket;
