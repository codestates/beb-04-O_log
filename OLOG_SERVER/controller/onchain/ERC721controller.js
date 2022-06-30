require("dotenv").config();
const Web3 = require("web3");
const { LOCAL_GANACHE, ERC721_ADDRESS, SERVER_ADDRESS, SERVER_PRIVATE_KEY } =
  process.env;
const ERC721_abi =
  require("../../truffle/build/contracts/OLOG_ERC721.json").abi;
const web3 = new Web3(LOCAL_GANACHE);

const ERC721Contract = new web3.eth.Contract(ERC721_abi, ERC721_ADDRESS);

const serverAccount = web3.eth.accounts.privateKeyToAccount(SERVER_PRIVATE_KEY);
const User = require("../../models/user");
const NFT = require("../../models/nft");
module.exports = {
  ServerNFTBuy: async (req, res) => {
    //토큰 URI랑 해당 사용자 주소 넣고 그냥 바로 mintNFT 실행해버리기
    //NFTRewardFactor는 민팅시 1로 고정됩니다.
    const { tokenURI } = req.body;
    //토큰 아이디는 살때 정해짐
    const username = res.locals.user.username;
    if (!username) return res.send("Not logged in");
    console.log("current ueer", username);

    const result = await User.findByUsername(username);
    const { address, receivedToken, expectedToken } = result;
    if (receivedToken + expectedToken < 100)
      return res.send("You don't have enough balance");
    if (receivedToken < 100)
      return res.send("Please proceed wallet synchronization");

    console.log("NFT Buy in progress");
    const ERC721_mintNFTData = await ERC721Contract.methods
      .mintNFT(address, tokenURI)
      .encodeABI();
    //methods.myMethod 부분을 파라미터화 할 수 없어서 함수화 불가능

    const ERC721_mintNFTtx = {
      from: SERVER_ADDRESS,
      to: ERC721_ADDRESS,
      gas: 3000000,
      data: ERC721_mintNFTData,
    };

    const signedERC721mintNFTtx = await serverAccount.signTransaction(
      ERC721_mintNFTtx
    );

    const transactionResult = await web3.eth.sendSignedTransaction(
      signedERC721mintNFTtx.rawTransaction,
      async (err, hash) => {
        if (!err) {
          console.log("Success");
          //이벤트를 받아올수가 없어서 그냥 메소드 call해서 토큰아이디 받아옴
          const tokenId = await ERC721Contract.methods.totalSupply().call();
          //유저 정보도 DB에서 receivedToken 삭제시켜주기
          const NFTAdd = await User.findOneAndUpdate(
            { username: username },
            {
              receivedToken: receivedToken - 100,
              $push: { NFTPossessed: tokenId },
            },
            { new: true }
          );
          console.log("DB NFT ADD", NFTAdd);

          // DB에 정보 업데이트, 첫 발행이니까 데이터는 정해져 있음
          // tokenId, sold로 거래소에 등록은 되었지만 컨트랙트상 발행되지 않은NFT도 DB에 저장( 오너는 서버, sold is false )
          // 서버가 기존 DB에 NFT 정보만 저장해뒀다 발급하는 시나리오 기준으로 작성, 토큰URL를 이용해 발행해주므로 그것으로 쿼리
          const filter = { tokenURI: tokenURI };
          const update = {
            tokenId: tokenId,
            NFTrewardFactor: 1,
            ownerUsername: username,
            ownerAddress: address,
            price: 99999,
            sold: true,
          };
          const opt = { new: true };
          let updatedResult = await NFT.findOneAndUpdate(filter, update, opt);
          res.send(updatedResult);
        } else {
          console.log("mintNFT Fail");
          return res.send("Minting Failed");
        }
      }
    );

    //컨트랙트 이벤트 리스너

    // let EVENT = ERC721Contract.events.Sold();

    // await EVENT.on({}, (err, result) => {
    //   console.log("11");
    //   console.log(result);
    // }); 아무리해도 이벤트를 받아오지 않는다...

    // console.log("balance update", updateBalance);
  },

  UpgradeNFT: async (req, res) => {
    //Upgrade메서드 실행
    const { tokenId } = req.body;
    const username = res.locals.user.username;
    const { address, NFTPossessed, receivedToken } = await User.findByUsername(
      username
    );
    if (!NFTPossessed.includes(tokenId))
      return res.send("You don't have this NFT");
    //거지인지 아닌지 확인하기
    const { NFTrewardFactor } = await NFT.findBytokenId(tokenId);
    console.log("DB NFTrewardFactor : ", NFTrewardFactor);
    if (NFTrewardFactor === 3) return res.send("3"); //meaning fully upgraded
    let price = NFTrewardFactor === 1 ? 100 : 1000; // 1이면 백원 2면 천원;

    if (receivedToken < 100 && NFTrewardFactor === 1)
      return res.send("Not enough balance");
    else if (receivedToken < 1000 && NFTrewardFactor === 3)
      return res.send("Not enough balance");
    //확인

    const ERC721_UpgradeNFTData = await ERC721Contract.methods
      .upgradeNFT(address, tokenId)
      .encodeABI();
    ////////////////
    const ERC721_UpgradeNFTtx = {
      from: SERVER_ADDRESS,
      to: ERC721_ADDRESS,
      gas: 3000000,
      data: ERC721_UpgradeNFTData,
    };

    const signedERC721UpgradeNFTtx = await serverAccount.signTransaction(
      ERC721_UpgradeNFTtx
    );

    await web3.eth.sendSignedTransaction(
      signedERC721UpgradeNFTtx.rawTransaction,
      async (err, hash) => {
        if (!err) console.log("Upgrade Transaction success");
        else return res.send("Transaction Failed");
      }
    );
    //////////////// 이부분 나중에 함수화로 리팩터링

    //강화 결과 확인
    let upgradeResult = Number(
      await ERC721Contract.methods.rewardFactorOf(tokenId).call()
    );
    //체인에서 가져온 모든 데이터는 스트링

    console.log("chain upgrade result : ", upgradeResult);
    console.log("upgrade Price : ", price);

    try {
      if (price === 100) {
        //NFTRewardFactor 1 -> 2
        const updatedToken = receivedToken - price;
        //잔고 인출 DB반영
        await User.findOneAndUpdate(
          { username: username },
          { receivedToken: updatedToken },
          { new: true }
        );

        if (upgradeResult === 2) {
          console.log("upgrade 1->2 success");
          await NFT.findOneAndUpdate(
            { tokenId: tokenId },
            { NFTrewardFactor: 2 },
            { new: true }
          );
          return res.send("1"); //1번은 1->2에성공했다는듯
        } else if (upgradeResult === 1) {
          console.log("upgrade failed");
          return res.send("0"); //0번은 업그레이드 실패
        }
      } else if (price === 1000) {
        //NFTRewardFactor 2 -> 3
        const updatedToken = receivedToken - price;
        //잔고 인출 DB반영
        await User.findOneAndUpdate(
          { username: username },
          { receivedToken: updatedToken },
          { new: true }
        );

        if (upgradeResult === 3) {
          console.log("upgrade 2->3 success");
          await NFT.findOneAndUpdate(
            { tokenId: tokenId },
            { NFTrewardFactor: 3 },
            { new: true }
          );
          return res.send("2"); //2번은 2->3에 성공했다는 뜻
        } else if (upgradeResult === 2) {
          console.log("upgrade failed");
          return res.send("0");
        }
      }
    } catch (err) {
      res.send(err);
    }
  },

  NFTSell: async (req, res) => {
    const { username, tokenId, price } = req.body;
    const haveNFT = (await User.findByUsername(username)).NFTPossessed;
    if (!haveNFT.includes(tokenId)) res.send("You don't have this NFT");
    const marketResult = await NFT.findOneAndUpdate(
      { tokenId: tokenId },
      { price: price, sold: false },
      { new: true }
    );

    res.send(marketResult);
    //DB에서만 조작
  },

  UserNFTBuy: async (req, res) => {
    //UserNFTSold 메서드 실행, 실제로 스마트컨트랙트에서 체결
    const { buyer, tokenId, payment } = req.body;
    //구매자의 유저네임, 판매자의 유저네임, 토큰아이디, 지불금액을 받습니다.
    const isSelling = (await NFT.findBytokenId(tokenId)).sold;
    if (!isSelling) res.send("This NFT is not on sale");
    if (payment < price) res.send("Your payment is not enough");

    const sellerAddress = (await NFT.findBytokenId(tokenId)).ownerAddress;
    const buyerAddress = (await User.findByUsername(buyer)).address;

    const ERC721_userBuy = await ERC721Contract.methods
      .UserNFTSold(buyerAddress, sellerAddress, tokenId, payment)
      .encodeABI();

    const ERC721_userBuyTx = {
      from: SERVER_ADDRESS,
      to: ERC721_ADDRESS,
      gas: 3000000,
      data: ERC721_userBuy,
    };

    const signedERC721userBuyTx = await serverAccount.signTransaction(
      ERC721_userBuyTx
    );

    web3.eth.sendSignedTransaction(
      signedERC721userBuyTx.rawTransaction,
      async (err, hash) => {
        if (!err) {
          console.log("NFT Sold");
          const NFTResult = await NFT.findOneAndUpdate(
            { tokenId: tokenId },
            {
              ownerUsername: buyer,
              ownerAddress: buyerAddress,
              price: payment,
              sold: true,
            },
            { new: true }
          );
          await User.findOneAndUpdate(
            { username: buyer },
            {
              receivedToken: receivedToken - payment,
              $push: { NFTPossessed: tokenId },
            },
            { new: true }
          );
          await User.findOneAndUpdate(
            { address: sellerAddress },
            {
              receivedToken: receivedToken + payment,
              $pull: { NFTPossessed: { $in: [tokenId] } },
            },
            { new: true }
          );
          res.send(NFTResult);
        } else {
          console.log("Transaction Failed");
        }
      }
    );
  },
};
