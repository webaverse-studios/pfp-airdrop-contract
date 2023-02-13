
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "./ERC721A.sol";

contract PFP is ERC721A, Ownable {
    using Strings for uint256;
    
    uint256 public MAX_TOKENS = 20000;
    bool public saleIsActive = false;
    string public baseExtension = ".json";
    string private _baseURIextended;
    address public _passAddress;

    mapping (address => bool) private _isAirdropped;

    // WhiteLists for presale.
    // mapping (address => bool) private _isWhiteListed;
    // mapping (address => uint) private _numberOfWallets;
    
    constructor(
        address passAddress_
    ) ERC721A("PFP", "PFP") {
        _passAddress = passAddress_;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner() {
        _baseURIextended = baseURI_;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
    
    function setPassContract(address passAddress_) public onlyOwner {
        _passAddress = passAddress_;
    }

    function getPassContract() public view returns (address) {
        return _passAddress;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
    {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, tokenId.toString(), baseExtension))
            : "";
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }


    function mintToken(uint numberOfTokens) public {
        require(saleIsActive, "Sale must be active to mint Tokens");
        require(totalSupply() + numberOfTokens <= MAX_TOKENS, "Purchase would exceed max supply of tokens");
        _safeMint(msg.sender, numberOfTokens);
    }

    function airdropToken() public onlyOwner {
        uint256 passSupply = uint256(IERC721Enumerable(_passAddress).totalSupply());
        
        for(uint i=0; i<passSupply; i++) {
            address passOwner = IERC721(_passAddress).ownerOf(i);
            if(!_isAirdropped[passOwner]) {
                uint256 passBalance = IERC721(_passAddress).balanceOf(passOwner);
                _safeMint(passOwner, passBalance);
                _isAirdropped[passOwner] = true;
            }
        }        
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

}