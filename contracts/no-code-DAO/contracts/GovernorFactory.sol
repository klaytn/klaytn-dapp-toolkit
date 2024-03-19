// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "./libraries/Bytes32ToAddressMapUpgradeable.sol";
import "./interfaces/ITimelockControllerInitilizer.sol";

contract GovernorFactory is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using Bytes32ToAddressMapUpgradeable for Bytes32ToAddressMapUpgradeable.Bytes32ToAddressMap;
    using ClonesUpgradeable for address;

    Bytes32ToAddressMapUpgradeable.Bytes32ToAddressMap private governorPresets;
    Bytes32ToAddressMapUpgradeable.Bytes32ToAddressMap private voteTokenPresets;
    address public timelockController;
    uint256 private totalGovernor;
    mapping(uint256 => Governor) public governors;

    struct Governor {
        address governor;
        address voteToken;
        address timelock;
    }

    struct TimelockInitializeParams {
        uint256 timelockMinDelay;
        address[] timelockProposers;
        address[] timelockExecutors;
        address timelockAdmin;
    }

    // ========== Events ==========

    event GovernorCreated(
        uint256 id,
        address governor,
        address voteToken,
        address timelock
    );

    // ========== Modifiers ==========

    modifier isValidName(string calldata name) {
        require(bytes(name).length <= 32, "GovernorFactory: invalid name");
        _;
    }

    // ========== Gorvernance ==========

    function initialize(address _timelockController) public initializer {
        timelockController = _timelockController;
        __Ownable_init();
    }

    ///@dev required by the OZ UUPS module
    function _authorizeUpgrade(address) internal override onlyOwner {}

    function addGovernorPreset(
        string calldata _name,
        address _governorPreset
    ) external onlyOwner isValidName(_name) {
        uint8 nameLength = uint8(bytes(_name).length);
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        governorPresets.set(bytesName, _governorPreset, nameLength);
    }

    function addVoteTokenPreset(
        string calldata _name,
        address _voteTokenPresets
    ) external onlyOwner isValidName(_name) {
        uint8 nameLength = uint8(bytes(_name).length);
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        voteTokenPresets.set(bytesName, _voteTokenPresets, nameLength);
    }

    // ========== Public functions ==========

    function createGovernor(
        string calldata _governorPreset,
        bytes calldata _governorInitializeData,
        string calldata _voteTokenPreset,
        bytes calldata _voteTokenInitializeData,
        TimelockInitializeParams calldata _timelockParams,
        bytes32 salt
    ) external returns (address governor, address voteToken, address timelock) {
        governor = getGovernorPresetAddress(_governorPreset).cloneDeterministic(
            salt
        );
        voteToken = getVoteTokenPresetAddress(_voteTokenPreset)
            .cloneDeterministic(salt);
        timelock = timelockController.cloneDeterministic(salt);

        (bool success, bytes memory result) = voteToken.call(
            _voteTokenInitializeData
        );

        require(
            success,
            "GovernorFactory: failed to call initialize vote token"
        );

        bool initialized = abi.decode(result, (bool));
        require(initialized, "GovernorFactory: failed to initialize governor");

        (bool success_2, bytes memory result_2) = governor.call(
            _governorInitializeData
        );

        require(
            success_2,
            "GovernorFactory: failed to call initialize governor"
        );
        bool initialized_2 = abi.decode(result_2, (bool));
        require(
            initialized_2,
            "GovernorFactory: failed to initialize governor"
        );

        ITimelockControllerInitilizer(timelock).initialize(
            _timelockParams.timelockMinDelay,
            _timelockParams.timelockProposers,
            _timelockParams.timelockExecutors,
            _timelockParams.timelockAdmin
        );

        uint256 governorId = totalGovernor;
        governors[governorId] = Governor(governor, voteToken, timelock);

        emit GovernorCreated(governorId, governor, voteToken, timelock);

        totalGovernor++;
    }

    function initializeGovernor() external {}

    // ========== View functions ==========
    function predictGovernorDeterministicAddress(
        string calldata _governorPreset,
        bytes32 _salt
    ) external view returns (address) {
        return
            getGovernorPresetAddress(_governorPreset)
                .predictDeterministicAddress(_salt);
    }

    function predictVoteTokenDeterministicAddress(
        string calldata _voteTokenPreset,
        bytes32 _salt
    ) external view returns (address) {
        return
            getVoteTokenPresetAddress(_voteTokenPreset)
                .predictDeterministicAddress(_salt);
    }

    function predictTimelockDeterministicAddress(
        bytes32 _salt
    ) external view returns (address) {
        return timelockController.predictDeterministicAddress(_salt);
    }

    function getAllGovernorPresets() external view returns (string[] memory) {
        bytes[] memory keysBytes = governorPresets.keysPacked();
        string[] memory keys = new string[](keysBytes.length);
        for (uint256 i = 0; i < keysBytes.length; i++) {
            keys[i] = string(keysBytes[i]);
        }
        return keys;
    }

    function getAllVoteTokenPresets() external view returns (string[] memory) {
        bytes[] memory keysBytes = voteTokenPresets.keysPacked();
        string[] memory keys = new string[](keysBytes.length);
        for (uint256 i = 0; i < keysBytes.length; i++) {
            keys[i] = string(keysBytes[i]);
        }
        return keys;
    }

    function getGovernorPresetAddress(
        string calldata _name
    ) public view isValidName(_name) returns (address) {
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        return governorPresets.get(bytesName);
    }

    function getVoteTokenPresetAddress(
        string calldata _name
    ) public view isValidName(_name) returns (address) {
        bytes32 bytesName = bytes32(abi.encodePacked(_name));
        return voteTokenPresets.get(bytesName);
    }

    // ========== Private functions ==========
}
