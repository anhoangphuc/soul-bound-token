// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract AnonymousSbt is Ownable, ERC721 {
   
    struct SBT {
        string secret;
        bytes32 commitment;
    }

    using Counters for Counters.Counter;
    Counters.Counter private tokenCounts;

    mapping(address => SBT) public sbts;

    error TransferNotAllowed();

    constructor() ERC721("AnonymousSBT", "ABT") {
        _transferOwnership(msg.sender);        
    }

    function _beforeTokenTransfer(address from, address, uint256) pure internal override {
        //dont allow to transfer from normal address
        if (from != address(0)) revert TransferNotAllowed();
    }

    function mint(address to, string calldata secret, bytes32 commitment) public onlyOwner {
        require(balanceOf(to) == 0, 'mint::already minted');    
        _mint(to, tokenCounts.current());
        sbts[msg.sender] = SBT(secret, commitment);
        tokenCounts.increment();
    }
}