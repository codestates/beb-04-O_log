const Accounts = require("web3-eth-accounts");

const accounts = new Accounts("http://127.0.0.1:7545");
const created = accounts.create(
  "dfkjgbdkfjbdfjkbdkfvbdkhfjbvdfjkhbvhjdfbvjhdfbvjhbdfvhbfdvbhjdfvhj"
);

console.log(created);
//서버 계정을 만드는 코드입니다.
//근데 가나슈에서 못써서 의미 없음
