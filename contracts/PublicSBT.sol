// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PublicSbt is Ownable, ERC721 {
   
    struct SBT {
        uint16 age;
        string name;
    }

    using Counters for Counters.Counter;
    Counters.Counter private tokenCounts;

    mapping(address => SBT) public sbts;

    error TransferNotAllowed();

    constructor() ERC721("PubcSBT", "PBT") {
        _transferOwnership(msg.sender);        
    }

    function _beforeTokenTransfer(address from, address, uint256) pure internal override {
        //dont allow to transfer from normal address
        if (from != address(0)) revert TransferNotAllowed();
    }

    function mint(address to, uint16 age) public onlyOwner {
        require(balanceOf(to) == 0, 'mint::already minted');    
        _mint(to, tokenCounts.current());
        sbts[msg.sender] = SBT(age, "Alice");
        tokenCounts.increment();
    }
}