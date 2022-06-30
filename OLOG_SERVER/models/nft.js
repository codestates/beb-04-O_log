const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    // required: true,
  },
  tokenURI: {
    type: String,
    unique: true,
    // required: true,
  },
  NFTrewardFactor: {
    type: Number,
  },
  ownerUsername: {
    type: String,
    //user address로 찾아서 username이랑 연결
  },
  ownerAddress: {
    type: String,
  },
  price: {
    type: Number,
    //사고팔때도 생각
  },
  sold: {
    type: Boolean,
    //마켓플레이스 판매현황관리 true면 개인소유중 false면 공개판매중
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

nftSchema.statics.findByUsername = function (ownerUsername) {
  return this.findOne({ ownerUsername });
};

nftSchema.statics.findBytokenId = function (tokenId) {
  return this.findOne({ tokenId });
};

module.exports = mongoose.model("NFT", nftSchema);
