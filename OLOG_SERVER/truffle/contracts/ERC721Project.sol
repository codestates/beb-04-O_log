// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/utils/Counters.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";

contract OLOG_ERC721 is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    IERC20 token;
    uint256 nftPrice;
    uint256 nonce;
    event Upgrade(uint256 tokenId, uint256 reward_factor, bool success);
    event Sold(address buyer, address seller, uint256 price);

    constructor() ERC721("OlogNFTs", "OLOG") {
        nftPrice = 100;
        nonce = 1;
    }

    mapping (uint256 => uint256) public reward_factor;
    //reward_factor[tokenId] = NFT's reward_factor, begins with 1;

    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        require(token.balanceOf(recipient) >= 0, "Check that you set the ERC20 address" );
        require(token.balanceOf(recipient) >= nftPrice,"Not enough balance");

        token.transferFrom(recipient, msg.sender, nftPrice); //msg.sender is server address
        //If we use transferFrom like this, caller becomes NFT's contract address, not msg.sender which is the server
        //transferFrom check allowance of caller not allowance of to(msg.sender). However, amount is deducted from caller's allowance.
        
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        reward_factor[newItemId] = 1;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        _approve(msg.sender, newItemId);


        emit Sold(recipient, msg.sender, nftPrice);

        return newItemId;
    }

    function setERC20Address (address tokenAddress) public onlyOwner returns (bool) {
        require(tokenAddress != address(0x0));
        token = IERC20(tokenAddress);
        return true;
    }

    function UserNFTSold(address buyer,address seller, uint256 tokenId, uint256 tokenPaid) public onlyOwner returns(bool) {
        require(seller == ownerOf(tokenId), "Token owner is not a seller");
        require(token.balanceOf(buyer) >= tokenPaid, "Buyer has not enough balance" );
        token.transferFrom(buyer, seller ,tokenPaid); //ERC20 Token payment
        transferFrom(seller, buyer, tokenId); //ERC721 Token payment
        emit Sold(buyer, seller, tokenPaid);
        
        return true;
    }

    function _randomDice () internal returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp,block.difficulty,nonce))) % 6;
        randomNumber = randomNumber + 1;
        nonce++;

        return randomNumber;
    }

    function totalSupply() public view returns(uint256){
        return _tokenIds.current();
    }

    function upgradeNFT (address owner, uint256 tokenId) public returns(uint256) {
        require(owner == ownerOf(tokenId), "NFT owner is not a caller");
        if (reward_factor[tokenId] == 1){
            //token price to upgrade is 100
            require(token.balanceOf(owner) >= 100, "Not enough token balance");
            token.transferFrom(owner, msg.sender, 100);
            uint256 diceResult = _randomDice();
            if(diceResult == 1 || diceResult == 2){
                //upgrade success
                reward_factor[tokenId] = 2;
                emit Upgrade(tokenId, reward_factor[tokenId], true);
                return reward_factor[tokenId];
            }
            else{
                emit Upgrade(tokenId, reward_factor[tokenId], false);
                return reward_factor[tokenId];
            }
        }
        else if (reward_factor[tokenId] == 2){
            //token price to upgrade is 1000
            require(token.balanceOf(owner) >= 1000, "Not enough token balance");
            token.transferFrom(owner, msg.sender, 1000);
            uint256 diceResult = _randomDice();
            if(diceResult == 3){
                //upgrade success
                reward_factor[tokenId] = 3;
                emit Upgrade(tokenId, reward_factor[tokenId], true);
                return reward_factor[tokenId];
            }
            else{
                emit Upgrade(tokenId, reward_factor[tokenId], false);
                return reward_factor[tokenId];
            }
        }
        else{
            revert("Your Item is not upgradable any more");
        }
    }

    function rewardFactorOf(uint256 tokenId) public view returns(uint256){
        return reward_factor[tokenId];
    }
}