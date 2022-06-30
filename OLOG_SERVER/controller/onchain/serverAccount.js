require("dotenv").config();
const Web3 = require("web3");
const { LOCAL_GANACHE, SERVER_ADDRESS } = process.env;
//서버계정의 잔고를 가져옵니다
module.exports = {
  balance: async (req, res) => {
    const web3 = new Web3(LOCAL_GANACHE);
    const balance = await web3.eth.getBalance(SERVER_ADDRESS);
    const etherBalance = web3.utils.fromWei(balance, "ether");
    res.send(etherBalance);
  },
};
