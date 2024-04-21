// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@klaytn/contracts/token/ERC20/IERC20.sol";
import { VRFConsumerBase } from "@bisonai/orakl-contracts/src/v0.1/VRFConsumerBase.sol";
import { IVRFCoordinator } from "@bisonai/orakl-contracts/src/v0.1/interfaces/IVRFCoordinator.sol";

contract ContributionSystem is VRFConsumerBase {
    struct Participant {
        uint id;
        uint depositAmount;
        uint lastDepositTime;
        bool exists;
        bool receivedFunds;
    }

    address public host;
    uint public dayRange;
    uint public expectedNumber;
    uint public currentSegment;
    uint public contributionAmount;
    address public tokenAddress; // Added token address
    mapping(address => Participant) public participants;
    address[] public participantList;
    uint public totalAmount = IERC20(tokenAddress).balanceOf(address(this));

    event Deposit(address indexed participant, uint amount);
    event FundsTransferred(address indexed from, address indexed to, uint amount);
    event SegmentEnd(uint segmentNumber);
    event RandomNumberGenerated(uint256 randomNumber);

    IVRFCoordinator private COORDINATOR;
    bytes32 private keyHash;
    uint256 private fee;
    uint256 public sRandomWord;

    constructor(address coordinator, bytes32 _keyHash, uint256 _fee, uint _dayRange, uint _expectedNumber, uint _contributionAmount, address _tokenAddress) 
        VRFConsumerBase(coordinator) 
    {
        host = msg.sender;
        dayRange = _dayRange;
        expectedNumber = _expectedNumber;
        contributionAmount = _contributionAmount;
        tokenAddress = _tokenAddress; // Initialize token address
        currentSegment = 1;
        COORDINATOR = IVRFCoordinator(coordinator);
        keyHash = _keyHash;
        fee = _fee;
    }

    modifier onlyHost() {
        require(msg.sender == host, "Only the host can call this function");
        _;
    }

    modifier canJoin() {
        require(!participants[msg.sender].exists, "You are already a participant");
        _;
    }

    function join() external payable canJoin {
        Participant storage participant = participants[msg.sender];
        participant.id = participantList.length + 1;
        participant.exists = true;
        participantList.push(msg.sender);
        emit Deposit(msg.sender, msg.value);
    }

    function deposit(uint _amount) external {
        Participant storage participant = participants[msg.sender];
        require(participant.exists, "You are not a participant");
        require(block.timestamp >= participant.lastDepositTime + dayRange * 1 days, "You can only deposit once per segment");

        // Transfer tokens from sender to contract
        require(IERC20(tokenAddress).transferFrom(msg.sender, address(this), _amount), "Token transfer failed");
        require(_amount == contributionAmount, "Please send the exact deposit amount");

        participant.depositAmount += _amount;
        participant.lastDepositTime = block.timestamp;
        emit Deposit(msg.sender, _amount);
    }

    function distributeFunds() external onlyHost {
        require(participantList.length == expectedNumber, "Expected number of participants not reached");
        require(currentSegment <= expectedNumber, "All segments have been completed");

        
        
        // Calculate 2% share for the host
        uint hostShare = totalAmount * 2 / 100;
        payable(msg.sender).transfer(hostShare);
        
        // Deduct host share from the total amount
        totalAmount -= hostShare;

        // Request a random number from the VRF Coordinator
        requestRandomWords(keyHash, 0, 300000, 1);
    }

    function requestRandomWords(
        bytes32 _keyHash,
        uint64 _accId,
        uint32 _callbackGasLimit,
        uint32 _numWords
    ) public returns (uint256 requestId) {
        requestId = COORDINATOR.requestRandomWords(_keyHash, _accId, _callbackGasLimit, _numWords);
    }

    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory _randomWords) internal override {
        sRandomWord = _randomWords[0];
        // Select a random participant who hasn't received funds yet
        address randomParticipant = participantList[sRandomWord % participantList.length];
        while (participants[randomParticipant].receivedFunds) {
            randomParticipant = participantList[sRandomWord % participantList.length];
        }

        // Transfer remaining funds to the random participant
        require(IERC20(tokenAddress).transfer(randomParticipant, totalAmount), "Token transfer failed");
        participants[randomParticipant].receivedFunds = true;
        emit FundsTransferred(address(this), randomParticipant, totalAmount);

        // Increment segment count
        currentSegment++;

        // If all segments have been completed, reset segment count and emit event
        if (currentSegment > expectedNumber) {
            currentSegment = 1;
            emit SegmentEnd(expectedNumber);
        }
    }

    function getRandomParticipant() internal view returns (address) {
        uint randIndex = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, blockhash(block.number - 1)))) % participantList.length;
        return participantList[randIndex];
    }

    function withdraw() external onlyHost {
        require(IERC20(tokenAddress).transfer(host, totalAmount), "Token transfer failed");
    }
}
