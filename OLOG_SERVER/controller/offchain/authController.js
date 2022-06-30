const User = require("../../models/user");
const Web3 = require("web3");
require("dotenv").config();

module.exports = {
  /*
    POST /offchain/auth/register
    {
        username: '아이디',
        password: '비밀번호'
    }
    */
  register: async (req, res) => {
    const { username, password } = req.body;

    try {
      const exists = await User.findByUsername(username);
      if (exists) {
        res.status(409).send("이미 존재하는 회원입니다.");
        return;
      }

      const web3 = new Web3(process.env.LOCAL_GANACHE);
      const Account = await web3.eth.accounts.create();

      const newUser = new User({
        username,
        address: Account.address,
        privateKey: Account.privateKey,
      });

      await newUser.setPassword(password);
      await newUser.save();

      res.status(200).send(newUser.hidePw());
    } catch (e) {
      res.status(404).send(e);
    }
  },

  /*
    POST /offchain/auth/login
    {
        username: '아이디',
        password: '비밀번호'
    }
    */

  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(401).send("모든 값이 입력되지 않았습니다.");
      return;
    }

    try {
      const user = await User.findByUsername(username);
      if (!user) {
        res.status(401).send("계정이 존재하지 않습니다.");
        return;
      }
      const valid = await user.checkPassword(password);
      if (!valid) {
        res.status(401).send("잘못된 비밀번호 입니다.");
        return;
      }
      const token = user.generateToken();
      res.cookie("JWT_token", token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });
      res.status(200).send(user.hidePw());
    } catch (e) {
      res.status(404).send(e);
    }
  },

  /*
    GET /offchain/auth/check
    {
        username: '아이디',
        password: '비밀번호'
    }
    */
  check: (req, res) => {
    const { user } = res.locals;
    if (!user) {
      //로그인 중 아님
      res.status(401).send("로그인 중이 아닙니다.");
      return;
    }
    res.send(user);
  },

  /*
  POST /offchain/auth/logout
  {
    username: '아이디',
    password: '비밀번호'
}
*/
  logout: (req, res) => {
    res.cookie("JWT_token");
    res.status(200).send("로그아웃됨");
  },
};
