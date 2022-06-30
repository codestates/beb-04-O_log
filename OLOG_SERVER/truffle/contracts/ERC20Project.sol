// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract OLOG_ERC20 is ERC20, Ownable {
    address NFTContract;

    constructor() ERC20("OlogRewardToken", "OLOG") {
        NFTContract = address(0x0);
    }

    function mintToken(address to, uint256 amount) public onlyOwner returns (bool){
        require(NFTContract != address(0x0), "Please set NFT Contract Address First");
        require(to != address(0x0));
        require(amount > 0);
        _mint(to, amount);
        _approve(to, msg.sender, allowance(to, msg.sender) + amount);
        _approve(to, NFTContract, allowance(to, NFTContract) + amount);

        return true;
    }

    function multiMintToken(address[] calldata toArr, uint256[] calldata amountArr) public onlyOwner returns (bool){
	require(toArr.length == amountArr.length);
	for(uint256 i = 0; i < toArr.length; i++) {
        require(NFTContract != address(0x0), "Please set NFT Contract Address First");
	    require(toArr[i] != address(0x0));
	    require(amountArr[i] > 0);
	    _mint(toArr[i], amountArr[i]);
	    _approve(toArr[i], msg.sender, allowance(toArr[i], msg.sender) + amountArr[i]);
        _approve(toArr[i], NFTContract, allowance(toArr[i], NFTContract) + amountArr[i]);

	}
	return true;
}
    function setERC721Address(address NFTAddress) public onlyOwner returns (address) {
        NFTContract = NFTAddress;
        return NFTContract;
    }

}