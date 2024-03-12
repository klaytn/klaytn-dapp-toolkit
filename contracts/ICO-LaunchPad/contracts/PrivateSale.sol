// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract PrivateSale {
    address public owner;
    address public projectToken;
    uint256 public icoStartTime;
    uint256 public icoEndTime;
    bool public icoActive;
    uint256 public maxContribution;
    uint256 public totalParticipations = 0;
    uint256 public totalContributions = 0;
    uint256 public currentRate;
    mapping(address => uint256) public contributions;
    mapping(address => bool) public claimedTokens;
    mapping(address => bool) public whitelist; // New mapping for whitelist

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    modifier duringICO() {
        require(icoActive, "ICO not active");
        require(block.timestamp >= icoStartTime && block.timestamp <= icoEndTime, "ICO is not ongoing");
        _;
    }

    modifier afterICO() {
        require(!icoActive, "ICO is still active");
        require(!icoActive || block.timestamp > icoEndTime, "ICO has not ended yet");
        _;
    }

    modifier canContribute() {
        require(whitelist[msg.sender], "Address not whitelisted");
        require(contributions[msg.sender] == 0, "Already contributed");
        require(msg.value <= maxContribution, "Exceeds maximum contribution");
        _;
    }

    modifier hasNotClaimedTokens() {
        require(whitelist[msg.sender], "Address not whitelisted");
        require(!claimedTokens[msg.sender], "Tokens already claimed");
        _;
    }

    event Contribution(address indexed contributor, uint256 amount, uint256 currentRate);
    event TokensClaimed(address indexed contributor, uint256 amount);
    event ICOStarted(uint256 startTime, uint256 endTime);
    event ICOStopped();
    event WhitelistUpdated(address[] addresses, bool[] statuses); // New event for whitelist updates

    constructor(address _projectToken, uint256 _maxContribution) {
        owner = msg.sender;
        projectToken = _projectToken;
        maxContribution = _maxContribution;
    }

    function startICO(uint256 _duration) external onlyOwner {
        require(!icoActive, "ICO already active");
        icoStartTime = block.timestamp;
        icoEndTime = icoStartTime + _duration;
        icoActive = true;
        emit ICOStarted(icoStartTime, icoEndTime);
    }

    function stopICO() external onlyOwner {
        require(icoActive, "ICO not active");
        icoActive = false;
        emit ICOStopped();
    }

   function contribute(address referrer) external payable canContribute duringICO {
    require(msg.value > 0, "Contribution amount must be greater than 0");
    require(referrer != msg.sender, "Referrer cannot be the contributor");

    // Calculate the referral bonus
    uint256 referralBonus = (msg.value * 5) / 100; // 5% bonus

    // Update the contributions and totals
    contributions[msg.sender] = msg.value;
    totalContributions += msg.value;
    totalParticipations += 1;

    // Update the current rate
    currentRate = IERC20(projectToken).balanceOf(address(this)) / totalContributions;

    // Transfer the referral bonus to the referrer
    require(payable(referrer).send(referralBonus), "Referral bonus transfer failed");

    emit Contribution(msg.sender, msg.value, currentRate);
    emit Contribution(referrer, referralBonus, currentRate); // Emit event for the referral bonus
}

    function claimTokens() external hasNotClaimedTokens afterICO {
        require(contributions[msg.sender] > 0, "No contribution found");

        uint256 tokenAmount = contributions[msg.sender] * currentRate;

        claimedTokens[msg.sender] = true;

        // Transfer tokens to contributor
        require(IERC20(projectToken).transfer(msg.sender, tokenAmount), "Token transfer failed");

        emit TokensClaimed(msg.sender, tokenAmount);
    }

    function withdraw() external onlyOwner afterICO {
        // Transfer all ETH to the owner
        payable(owner).transfer(address(this).balance);
    }

    // Add function to add or remove addresses from the whitelist
    function updateWhitelist(address[] memory _addresses, bool[] memory _statuses) external onlyOwner {
        require(_addresses.length == _statuses.length, "Arrays length mismatch");
        for (uint256 i = 0; i < _addresses.length; i++) {
            whitelist[_addresses[i]] = _statuses[i];
        }
        emit WhitelistUpdated(_addresses, _statuses);
    }
}
