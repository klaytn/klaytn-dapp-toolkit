// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface ILotterySeedRandomness {
    error ZeroAmount();
    error ZeroAddress();
    error NotDrawingTime();
    error AlreadyDrawn();
    error NotFulfilled();
    error AlreadyFulfilled();
    error InvalidSeedRequestId();
    error InvalidRandomWords();
    error OnlyCoordinatorCanFulfill(address have, address want);

    event TotalTicketSet(uint256 totalTicket);
    event DrawingTimeSet(uint256 drawingTime);
    event TotalWinningTicketSet(uint256 totalWinningTicket);
    event VrfCoordinatorSet(address vrfCoordinator);
    event SubscriptionIdSet(uint64 subscriptionId);
    event KeyHashSet(bytes32 keyHash);
    event WinningSeedDrawn(uint256 seedRequestId);
    event WinningSeedFulfilled(uint256 winningSeed);
    event TicketOwnerDigestSet(bytes32 ticketOwnerDigest);

    function setDrawingTime(uint256 _drawingTime) external;

    function setVrfCoordinator(address _vrfCoordinator) external;

    function setSubscriptionId(uint64 _subscriptionId) external;

    function setKeyHash(bytes32 _keyHash) external;

    function drawWinningSeed() external;

    function rawFulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) external;
}
