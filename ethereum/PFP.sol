// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PFP is ERC721Enumerable, Ownable {

    address public passContract = 0x543D43F390b7d681513045e8a85707438c463d80;
    uint256 public MAX_TOKENS = 20000;
    bool public airdropIsActive = false;

    mapping(uint256 => bool) private _isOccupiedId;
    uint256[] private _occupiedList;

    constructor(address _passContract) ERC721("Webaverse Character", "WCC") {
        passContract = _passContract;
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, ERC721Enumerable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }

    function airdropToken(uint256[] memory _ids) public {
        uint256 numberOfTokens = _ids.length;
        uint256 balanceOfPassToken = unt256(IERC721(passContract).balanceOf(msg.sender));

        require(airdropIsActive, "Airdrop must be active to claim Tokens");
        require(numberOfTokens + balanceOf(msg.sender) <= balanceOfPassToken, "Exceeded max token claim");
        require(totalSupply() + numberOfTokens <= MAX_TOKENS, "Purchase would exceed max supply of tokens");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            require(_isOccupiedId[_ids[i]] == false, "Those ids already have been claimed for other customers");
        }

        for(uint i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, _ids[i]);
            _isOccupiedId[ _ids[i]] = true;
            _occupiedList.push( _ids[i]);
        }
    }

    function occupiedList() public view returns (uint256[] memory) {
      return _occupiedList;
    }

    function flipAirdropState() public onlyOwner {
        airdropIsActive = !airdropIsActive;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}