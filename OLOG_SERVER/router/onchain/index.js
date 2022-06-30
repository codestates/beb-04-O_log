const { walletSync } = require("../../controller/onchain/ERC20controller");
const {
  ServerNFTBuy,
  UpgradeNFT,
  NFTSell,
  UserNFTBuy,
} = require("../../controller/onchain/ERC721controller");
const express = require("express");
const router = express.Router();

router.route("/walletSync").get(walletSync); //지갑 동기화
router.route("/serverNFTBuy").post(ServerNFTBuy);
router.route("/upgradeNFT").post(UpgradeNFT);
// router.route("/nftSell").post(NFTSell);
// router.route("/userNFTBuy").post(UserNFTBuy);

module.exports = router;
