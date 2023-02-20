// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract VRFConsumerMock {

  constructor(address _vrfCoordinator, address _link) {
    //vrfCoordinator = _vrfCoordinator;
    //LINK = LinkTokenInterface(_link);
  }

  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal virtual;

  function requestRandomness(bytes32, uint256) internal returns (bytes32 requestId) {
    fulfillRandomness(requestId, 99);
    return (bytes32(0));
  }

}