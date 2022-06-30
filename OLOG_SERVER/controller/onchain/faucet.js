//API를 통해 거기서 ganache계정이 이더리음울 전송하도록 api 작성
//api에접근한 사람이 서버 관리자인지 확인
// Faucet fucntion 작성해서 라우터랑 연결
// const web3 = new Web3('http://localhost:7454);
// const accounts = await web3.eth.getAccounts();
// console.log(accounts);

//서버 관리자임이 확인되면 이더를 전송하는 트랜잭션 실행, 사인해서 보내면 됨
// API 문서를 바탕으로 다음의 순서에 따라 코드를 작성합니다. 서버와 데이터베이스 뼈대는 유닛1에서 이어집니다.

// 이더를 전송하는 트랜잭션을 보냅니다. 개인키를 사용해 트랜잭션에 서명을 하고 트랜잭션을 보내는 방식을 사용합니다.
// 데이터베이스에서 가져온 개인키를 사용해 트랜잭션에 서명을 하기 위해서는 개인키를 web3.eth.accounts에 등록해야 합니다.
// web3.eth.account.privateKeyToAccount() 메서드를 사용하면 개인키를 등록할 수 있습니다.
// 트랜잭션에 서명을 하기 위해서는 web3.eth.accounts.signTransaction 메서드를 사용합니다.
// 서명한 트랜잭션을 전송하기 위해서는 web3.eth.sendSignedTransaction 메서드를 사용합니다.
// 각 메서드가 어떤 인자를 받고, 어떤 값을 리턴하는지 확인하세요.
// 트랜잭션의 결과에 따라 응답합니다.
// API 문서의 형식에 맞춰 응답합니다.

require("dotenv").config();
const Web3 = require("web3");
const { LOCAL_GANACHE, FAUCET_ADDRESS, FAUCET_PRIVATE_KEY, SERVER_ADDRESS } =
  process.env;

module.exports = {
  //다른 로컬 노드에서는 주소를 변경해주세요
  ethFaucet: async (req, res) => {
    const web3 = new Web3(LOCAL_GANACHE);
    const transaction = {
      from: FAUCET_ADDRESS,
      to: SERVER_ADDRESS,
      value: "1000000000000000000",
      gas: 30000,
    };

    const faucetAccount = await web3.eth.accounts.privateKeyToAccount(
      FAUCET_PRIVATE_KEY
    );
    const signedTx = await faucetAccount.signTransaction(transaction);

    //트랜잭션을 보낼땐 헥스값으로 변한된 rawTransaction을 보내야한다, signedTx를 확인하자.
    web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, hash) => {
      if (!err) res.send(hash);
      else res.send(err);
    });
  },
};
