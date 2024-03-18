// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {VaultContract} from "./VaultContract.sol";
import {ISwap} from "./interfaces/ISwap.sol";
contract POS is Ownable {
    using Address for address payable;

    uint256 public constant VERSION = 1;

    address public verifier;
    address public swapContract;

    // mapping used signature
    mapping(bytes => bool) private invalidSignatures;

    event PaymentRequest(
        uint256 indexed _sessionId,
        address indexed _token,
        address _vault
    );

    /**
     * @dev Constructor
     * @notice The platform fee basis points must be less than 10000
     * @notice The fee to address must not be the zero address
     */
    constructor(address _swapContract) {
        swapContract = _swapContract;
    }

    function requestPayment(
        uint256 _sessionId,
        bytes calldata paymentData,
        address vaultAddress,
        address paymentToken
    ) external payable {
        (bool success, bytes memory result) = vaultAddress.call(paymentData);
        require(success, "POS: failed to request approve from vault contract");

        (address transferToken, uint256 amount) = abi.decode(
            result,
            (address, uint256)
        );
        if (paymentToken != transferToken) {
            ISwap(swapContract).swap(transferToken, paymentToken, amount);
        }

        emit PaymentRequest(_sessionId, paymentToken, vaultAddress);
    }
}