// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";

contract MockVRFCoordinator {
    uint256 public s_requestId;
    VRFConsumerBaseV2 public consumer;

    constructor(address _consumer, uint256 _requestId) {
        consumer = VRFConsumerBaseV2(_consumer);
        s_requestId = _requestId;
    }

    function requestRandomWords(
        bytes32,
        uint64,
        uint16,
        uint32,
        uint32
    ) public view returns (uint256 requestId) {
        return s_requestId;
    }

    function fulfillRandomness(
        uint256 _requestId,
        uint256[] calldata _randomness
    ) external {
        consumer.rawFulfillRandomWords(_requestId, _randomness);
    }
}
