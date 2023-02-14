
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "./ERC721A.sol";
import "./VRFConsumerBase.sol";

contract PFP is ERC721A, Ownable, VRFConsumerBase {
    using Strings for uint256;
    
    uint256 public MAX_TOKENS = 20000;
    bool public saleIsActive = false;
    string public baseExtension = ".json";
    string private _baseURIextended;
    address public _passAddress;
    bool public revealed = false;
    string public notRevealedUri = "";
    uint256 public randStartPos;
    bytes32 public vrfKeyHash;
    bytes32 public request_id;

    mapping (uint256 => bool) private _isClaimed;

    // WhiteLists for presale.
    // mapping (address => bool) private _isWhiteListed;
    // mapping (address => uint) private _numberOfWallets;
    
    constructor(
        address passAddress_,
        address _ChainlinkVRFCoordinator,
        address _ChainlinkLINKToken,
        bytes32 _ChainlinkKeyHash
    ) ERC721A("PFP", "PFP") VRFConsumerBase(_ChainlinkVRFCoordinator, _ChainlinkLINKToken) {
        _passAddress = passAddress_;
        vrfKeyHash = _ChainlinkKeyHash;
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

    function reveal() public onlyOwner {
        revealed = true;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
    {
        if(revealed == false) {
            return notRevealedUri;
        }
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, (tokenId+randStartPos).toString(), baseExtension))
            : "";
    }

    function flipSaleState() public onlyOwner {
        saleIsActive = !saleIsActive;
    }


    function mintToken(uint numberOfTokens) public {
        require(saleIsActive, "Sale must be active to mint Tokens");

        _safeMint(msg.sender, numberOfTokens);
    }

    function claimTokens(uint256[] memory _ids) public {
        uint256 numberOfTokens = _ids.length;
        require(totalSupply() + numberOfTokens <= MAX_TOKENS, "Claim would exceed max supply of tokens");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            address passOwner = IERC721(_passAddress).ownerOf(i);
            require(_isClaimed[_ids[i]] == true, "Those pass tokens already have been used for claiming.");
            require(msg.sender == passOwner, "You are not the owner of this pass tokens.");
        }

        
        _safeMint(msg.sender, numberOfTokens);
        
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _isClaimed[_ids[i]] = true;            
        }

    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function getPassSupply() public view returns (uint256) {
        uint256 passSupply = uint256(IERC721Enumerable(_passAddress).totalSupply());
        return passSupply;
    }

    function getPassOwner(uint256 i) public view returns (address, uint256) {
        address passOwner = IERC721(_passAddress).ownerOf(i);
        uint256 passBalance = IERC721(_passAddress).balanceOf(passOwner);
        return (passOwner, passBalance);
    }

    function getRandomNumber() public payable returns (bytes32 requestId) {
        uint256 fee = 0.1 * 10 ** 18;
        require( LINK.balanceOf(address(this)) >= fee, "YOU HAVE TO SEND LINK TOKEN TO THIS CONTRACT");
        return requestRandomness(vrfKeyHash, fee);
    }

    // this is callback, it will be called by the vrf coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        request_id = requestId;
        randStartPos = randomness % MAX_TOKENS;
    }



}