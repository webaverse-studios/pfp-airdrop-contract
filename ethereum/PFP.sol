
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./VRFConsumerBase.sol";
import "./ERC721A.sol";
import "./EPSInterface/IEPSDelegationRegister.sol";



contract PFP is ERC721A, Ownable, VRFConsumerBase {
    using Strings for uint256;
    
    uint256 public MAX_TOKENS = 20000;
    uint256 public tokenPrice;
    string public baseExtension = ".json";
    string private _baseURIextended;
    address public _passAddress;
    bool public revealed = false;
    string public notRevealedUri = "";
    uint256 public randStartPos;
    bytes32 public vrfKeyHash;
    bytes32 public request_id;
    IEPSDelegationRegister public EPS;
    mapping (uint256 => bool) private _isClaimed;
    
    constructor(
        address passAddress_,
        address epsAddress_,
        address _ChainlinkVRFCoordinator,
        address _ChainlinkLINKToken,
        bytes32 _ChainlinkKeyHash
    ) ERC721A("PFP", "PFP") VRFConsumerBase(_ChainlinkVRFCoordinator, _ChainlinkLINKToken) {
        _passAddress = passAddress_;
        vrfKeyHash = _ChainlinkKeyHash;
        EPS = IEPSDelegationRegister(epsAddress_);
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

    function setTokenPrice(uint256 _tokenPrice) public onlyOwner {
      tokenPrice = _tokenPrice;
    }

    function reveal() public onlyOwner {
      if(!revealed) {
        getRandomNumber();
        revealed = true;
      }
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    /**
     * Returns the tokenURI
     * Random starting positions can only be set before the token's metadata is revealed.
     *
     */
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory)
    {
        if(revealed == false) {
            return notRevealedUri;
        }
        string memory currentBaseURI = _baseURI();
        return bytes(currentBaseURI).length > 0
            ? string(abi.encodePacked(currentBaseURI, ((tokenId+randStartPos) % MAX_TOKENS).toString(), baseExtension))
            : "";
    }

    /**
     * Batch mint the pfp token as much as the pass token's amount
     * string
     *
     * @param _ids Pass token's id list
     */
    function claimTokens(uint256[] memory _ids) public {
        uint256 numberOfTokens = _ids.length;
        address[] memory coldWallets = EPS.getAddresses(msg.sender, _passAddress, 1, true, true);
        require(totalSupply() + numberOfTokens <= MAX_TOKENS, "Claim would exceed max supply of tokens");
        for (uint256 i = 0; i < numberOfTokens; i++) {
            address passOwner = IERC721(_passAddress).ownerOf(_ids[i]);
            bool isOwner = false;
            require(_isClaimed[_ids[i]] == false, "Those pass tokens already have been used for claiming.");
            for (uint256 j = 0; j < coldWallets.length; j++) {
              if(coldWallets[j]==passOwner)
                isOwner = true;
            }
            require(isOwner, "You are not the owner of these pass tokens.");
        }
        _safeMint(msg.sender, numberOfTokens);
        for (uint256 i = 0; i < numberOfTokens; i++) {
            _isClaimed[_ids[i]] = true;            
        }
    }

    /**
     * Returns a list of pass token IDs that have not yet been used for claiming.
     *
     * @param _ids Pass token's id list
     */
    function unclaimedTokens(uint256[] memory _ids) public view returns (uint256, uint256[] memory) {
        uint256[] memory unclaimed_list = new uint256[](_ids.length);
        uint256 unclaimed_count = 0;
        for (uint256 i = 0; i < _ids.length; i++) {
            if(!_isClaimed[_ids[i]]) {
                unclaimed_list[unclaimed_count] = _ids[i];
                unclaimed_count++;
            }
        }
        return(unclaimed_count, unclaimed_list);
    } 

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }

    function getRandomNumber() public payable returns (bytes32 requestId) {
        uint256 fee = 0.1 * 10 ** 18;
        require( LINK.balanceOf(address(this)) >= fee, "YOU HAVE TO SEND LINK TOKEN TO THIS CONTRACT");
        return requestRandomness(vrfKeyHash, fee);
    }

    // this is callback, it will be called by the vrf coordinator
    function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
        request_id = requestId;
        if(!revealed) {
          randStartPos = randomness % MAX_TOKENS;
        }
    }

}