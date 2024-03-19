// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

import "./interfaces/ILotterySeedRandomness.sol";

// @author danielNg25
contract LotterySeedRandomness is
    Ownable2StepUpgradeable,
    ILotterySeedRandomness
{
    uint256 public totalTicket;
    uint256 public totalWinningTicket;
    uint256 public drawingTime;
    uint256 public winningSeed;

    // @dev VRF configs
    address public vrfCoordinator;
    uint64 public subscriptionId;
    uint256 public seedRequestId;
    bool public fullfilled;

    bytes32 public keyHash;
    bytes32 public ticketOwnerDigest;
    uint32 constant CALLBACK_GAS_LIMIT = 100_000;
    uint16 constant REQUEST_CONFIRMATIONS = 3;

    modifier onlyWhenNotDraw() {
        if (seedRequestId != 0) revert AlreadyDrawn();
        _;
    }

    function initialize(
        uint256 _totalTicket,
        uint256 _totalWinningTicket,
        uint256 _drawingTime,
        address _vrfCoordinator,
        uint64 _subscriptionId,
        bytes32 _keyHash,
        bytes32 _ticketOwnerDigest
    ) public initializer {
        __Ownable2Step_init();

        if (_totalTicket == 0) revert ZeroAmount();
        totalTicket = _totalTicket;
        totalWinningTicket = _totalWinningTicket;
        drawingTime = _drawingTime;

        if (_vrfCoordinator == address(0)) revert ZeroAddress();
        vrfCoordinator = _vrfCoordinator;
        subscriptionId = _subscriptionId;
        keyHash = _keyHash;
        ticketOwnerDigest = _ticketOwnerDigest;
    }

    /**************************|
    |          Setters         |
    |_________________________*/

    function setTotalTicket(
        uint256 _totalTicket
    ) public onlyWhenNotDraw onlyOwner {
        if (_totalTicket == 0) revert ZeroAmount();
        totalTicket = _totalTicket;
        emit TotalTicketSet(_totalTicket);
    }

    function setTotalWinningTicket(
        uint256 _totalWinningTicket
    ) public onlyWhenNotDraw onlyOwner {
        totalWinningTicket = _totalWinningTicket;
        emit TotalWinningTicketSet(_totalWinningTicket);
    }

    function setTicketOwnerDigest(
        bytes32 _ticketOwnerDigest
    ) public onlyWhenNotDraw onlyOwner {
        ticketOwnerDigest = _ticketOwnerDigest;
        emit TicketOwnerDigestSet(_ticketOwnerDigest);
    }

    function setDrawingTime(
        uint256 _drawingTime
    ) public onlyWhenNotDraw onlyOwner {
        if (_drawingTime == 0) revert ZeroAmount();
        drawingTime = _drawingTime;
        emit DrawingTimeSet(_drawingTime);
    }

    function setVrfCoordinator(
        address _vrfCoordinator
    ) public onlyWhenNotDraw onlyOwner {
        if (_vrfCoordinator == address(0)) revert ZeroAddress();
        vrfCoordinator = _vrfCoordinator;
        emit VrfCoordinatorSet(_vrfCoordinator);
    }

    function setSubscriptionId(
        uint64 _subscriptionId
    ) public onlyWhenNotDraw onlyOwner {
        subscriptionId = _subscriptionId;
        emit SubscriptionIdSet(_subscriptionId);
    }

    function setKeyHash(bytes32 _keyHash) public onlyWhenNotDraw onlyOwner {
        keyHash = _keyHash;
        emit KeyHashSet(_keyHash);
    }

    /**************************|
    |       Draw Lottery       |
    |_________________________*/

    // @dev Draw the winning seed
    function drawWinningSeed() public onlyOwner {
        if (seedRequestId != 0) revert AlreadyDrawn();
        if (block.timestamp < drawingTime) revert NotDrawingTime();
        if (vrfCoordinator == address(0)) revert ZeroAddress();

        uint256 _seedRequestId = VRFCoordinatorV2Interface(vrfCoordinator)
            .requestRandomWords(
                keyHash,
                subscriptionId,
                REQUEST_CONFIRMATIONS,
                CALLBACK_GAS_LIMIT,
                1 // request 1 word
            );

        seedRequestId = _seedRequestId;
        emit WinningSeedDrawn(_seedRequestId);
    }

    // @dev fulfill winning seed
    function _setWinningSeed(uint256 _winningSeed) internal {
        if (fullfilled) revert AlreadyFulfilled();
        winningSeed = _winningSeed;
        fullfilled = true;
        emit WinningSeedFulfilled(_winningSeed);
    }

    /**************************|
    |    Get winning Ticket    |
    |_________________________*/

    function getWinningTickets() public view returns (uint256[] memory) {
        if (!fullfilled) return new uint256[](0);

        bytes32 _ticketOwnerDigest = ticketOwnerDigest;
        uint256[] memory listTickets = new uint256[](totalTicket);
        uint256[] memory winningTickets = new uint256[](totalWinningTicket);
        for (uint256 i = 0; i < totalWinningTicket; i++) {
            uint256 remainingTicket = totalTicket - i;
            uint256 winningIndex = uint256(
                keccak256(
                    abi.encodePacked(winningSeed, _ticketOwnerDigest, i + 1)
                )
            ) % remainingTicket;

            winningTickets[i] = listTickets[winningIndex] == 0
                ? winningIndex + 1
                : listTickets[winningIndex];
            // remove the selected value by swapping with the last unselected value
            uint256 lastUnselectedIndex = remainingTicket - 1;
            if (winningIndex < lastUnselectedIndex) {
                listTickets[winningIndex] = listTickets[lastUnselectedIndex] ==
                    0
                    ? remainingTicket
                    : listTickets[lastUnselectedIndex];
            }
        }

        return winningTickets;
    }

    /**************************|
    |            VRF           |
    |_________________________*/

    /**
     * @notice fulfillRandomness handles the VRF response. Your contract must
     * @notice implement it. See "SECURITY CONSIDERATIONS" above for important
     * @notice principles to keep in mind when implementing your fulfillRandomness
     * @notice method.
     *
     * @dev VRFConsumerBaseV2 expects its subcontracts to have a method with this
     * @dev signature, and will call it once it has verified the proof
     * @dev associated with the randomness. (It is triggered via a call to
     * @dev rawFulfillRandomness, below.)
     *
     * @param requestId The Id initially returned by requestRandomness
     * @param randomWords the VRF output expanded to the requested number of words
     */
    // solhint-disable-next-line chainlink-solidity/prefix-internal-functions-with-underscore
    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal {
        if (requestId != seedRequestId) revert InvalidSeedRequestId();
        if (randomWords.length != 1) revert InvalidRandomWords();
        _setWinningSeed(randomWords[0]);
    }

    // rawFulfillRandomness is called by VRFCoordinator when it receives a valid VRF
    // proof. rawFulfillRandomness then calls fulfillRandomness, after validating
    // the origin of the call
    function rawFulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) external {
        if (msg.sender != vrfCoordinator) {
            revert OnlyCoordinatorCanFulfill(msg.sender, vrfCoordinator);
        }
        fulfillRandomWords(requestId, randomWords);
    }
}
