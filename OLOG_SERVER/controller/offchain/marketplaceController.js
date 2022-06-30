const NFT = require("../../models/nft");
const axios = require("axios");
require("dotenv").config();

module.exports = {
  queryNFT: async (req, res) => {
    const queryAllNFT = await NFT.find({ sold: false });
    // req.query.part represents part of NFT query ~/?part = 1,2,3... (0~9)
    // let i,
    //   j,
    //   temparray = [],
    //   chunk = Math.floor(queryAllNFT.length / 10);
    // for (i = 0, j = queryAllNFT.length; i < j; i += chunk) {
    //   temparray.push(queryAllNFT.slice(i, i + chunk));
    // }
    // temparray[req.query.part], designated part of entire NFT array
    // const requestedNFT = temparray[req.query.part];
    const requestedNFT = queryAllNFT;

    const arr = await Promise.all(
      requestedNFT.map(async (el) => {
        const res = await axios.get(el.tokenURI);
        const metaData = res.data;
        return metaData;
      })
    );
    //arr랑 queryAllNFT랑 MAP으로 합쳐서 다시보내기
    const result = [];
    for (let i = 0; i < requestedNFT.length; i++) {
      result.push(Object.assign(arr[i], requestedNFT[i]._doc));
    }
    // let result = [];
    // const emails = ["alice@gmail.com", "bob@gmail.com", "charlie@gmail.com"];
    // const send = (email) =>
    //   new Promise((resolve) => setTimeout(() => resolve(email), 1000));
    // const sendAllEmails = async () => {
    //   for (email of emails) {
    //     const emailInfo = await send(email);
    //     console.log(emailInfo);
    //     result.push(emailInfo);
    //   }
    //   console.log("All emails were sent");
    //   res.send(result);
    // };
    // sendAllEmails();
    res.send(result);
  },
  myNFT: async (req, res) => {
    const username = res.locals.user.username;
    if (!username) return res.send("Not logged in");
    const queryMyNFT = await NFT.find({ ownerUsername: username });
    const arr = await Promise.all(
      queryMyNFT.map(async (el) => {
        const res = await axios.get(el.tokenURI);
        const metaData = res.data;
        return metaData;
      })
    );

    //arr랑 queryAllNFT랑 MAP으로 합쳐서 다시보내기
    const result = [];
    for (let i = 0; i < queryMyNFT.length; i++) {
      result.push(Object.assign(arr[i], queryMyNFT[i]._doc));
    }

    res.send(result);
  },
};
