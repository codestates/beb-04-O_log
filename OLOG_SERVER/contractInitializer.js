const Web3 = require("web3");
const Contract = require("web3-eth-contract");
const mongoose = require("mongoose");
require("dotenv").config();
const {
  LOCAL_GANACHE,
  ERC20_ADDRESS,
  ERC721_ADDRESS,
  SERVER_ADDRESS,
  SERVER_PRIVATE_KEY,
  USER_ADDRESS,
  USER_PRIVATE_KEY,
  MONGO_URI,
} = process.env;
const User = require("./models/user");

const web3 = new Web3(LOCAL_GANACHE);
const ERC721_abi = require("./truffle/build/contracts/OLOG_ERC721.json").abi;
const ERC20_abi = require("./truffle/build/contracts/OLOG_ERC20.json").abi;

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Successfully connected to mongodb"))
  .catch((e) => console.error(e));

console.log(
  "Make sure that you've put correct contract addresses into .env files"
);
async function initializer() {
  const serverAccount = await web3.eth.accounts.privateKeyToAccount(
    SERVER_PRIVATE_KEY
  );
  if (!ERC20_ADDRESS || !ERC721_ADDRESS)
    console.log("Please put contract addresses into .env file");

  //ERC721에선 ERC20토큰으로 구매가 가능하게 하기 위해 설정을 진행합니다, ERC20 에선 ERC721 컨트랙트에 토큰 전송 권한을 주기위해 설정을 진행합니다.
  try {
    //ERC721 Initializer, ERC20주소를 등록합니다

    const ERC721Contract = new Contract(ERC721_abi, ERC721_ADDRESS);
    const ERC721_InitData = await ERC721Contract.methods
      .setERC20Address(ERC20_ADDRESS)
      .encodeABI();
    const ERC721_InitTx = {
      from: SERVER_ADDRESS,
      to: ERC721_ADDRESS,
      gas: 3000000,
      data: ERC721_InitData,
    };

    const signedERC721InitTX = await serverAccount.signTransaction(
      ERC721_InitTx
    );

    web3.eth.sendSignedTransaction(
      signedERC721InitTX.rawTransaction,
      (err, hash) => {
        if (!err) {
          console.log("ERC721 Successfully Initialized");
        } else {
          console.log("ERC721 Initialization Failed");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
  //ERC20 Initializer, ERC721 주소를 등록합니다
  try {
    const ERC20Contract = new Contract(ERC20_abi, ERC20_ADDRESS);

    const ERC20_InitData = await ERC20Contract.methods
      .setERC721Address(ERC721_ADDRESS)
      .encodeABI();
    const ERC20_InitTx = {
      from: SERVER_ADDRESS,
      to: ERC20_ADDRESS,
      gas: 3000000,
      data: ERC20_InitData,
    };

    const signedERC20InitTX = await serverAccount.signTransaction(ERC20_InitTx);

    web3.eth.sendSignedTransaction(
      signedERC20InitTX.rawTransaction,
      (err, hash) => {
        if (!err) {
          console.log("ERC20 Successfully Initialized");
        } else {
          console.log("ERC20 Initialization Failed");
        }
      }
    );

    //유저 주소로 초기 토큰 민팅
    const ERC20_InitMint = await ERC20Contract.methods
      .mintToken(USER_ADDRESS, 100000)
      .encodeABI();
    const ERC20_InitMintTx = {
      from: SERVER_ADDRESS,
      to: ERC20_ADDRESS,
      gas: 3000000,
      data: ERC20_InitMint,
    };

    const signedERC20Mint = await serverAccount.signTransaction(
      ERC20_InitMintTx
    );

    web3.eth.sendSignedTransaction(
      signedERC20Mint.rawTransaction,
      async (err, hash) => {
        if (!err) {
          console.log("ERC20 Initial Mint Success");
          //DB에 잔고 반영
          const DBResult = await User.findOneAndUpdate(
            { username: "user" },
            { receivedToken: 100000 },
            { new: true }
          );
          console.log("DB Updated", DBResult);
          process.exit();
        } else {
          console.log("ERC20 Initial Mint Failed");
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
}

initializer();
