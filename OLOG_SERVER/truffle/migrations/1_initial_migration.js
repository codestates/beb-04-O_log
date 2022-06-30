const OLOG_ERC20 = artifacts.require("OLOG_ERC20");
const OLOG_ERC721 = artifacts.require("OLOG_ERC721");

//컨트랙트명으로 불러옴
module.exports = function (deployer) {
  deployer.deploy(OLOG_ERC20, {
    from: "0x566962cAe8DccBda49c6dE030a7e707f06AcA743",
  });
  deployer.deploy(OLOG_ERC721, {
    from: "0x566962cAe8DccBda49c6dE030a7e707f06AcA743",
  });
  //불러온 컨트랙트 디플로이
};
