// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract CrPayment is Ownable {
    using Address for address payable;

    uint256 public constant VERSION = 1;
    uint256 public constant BASIS_POINTS = 10000;

    address public feeTo;
    uint256 public platformFeeBasisPoints;
    address public verifier;

    // mapping used signature
    mapping(bytes => bool) private invalidSignatures;

    event FeeToAddressSet(address _feeTo);
    event PlatformFeeBasisPointsSet(uint256 _platformFeeBasisPoints);
    event VerifierAddressChanged(address oldAddress, address newAddress);
    event Payment(
        uint256 indexed _sessionId,
        address indexed _merchant,
        address _token,
        uint256 _amount
    );

    /**
     * @dev Constructor
     * @param _feeTo The address to receive the platform fee
     * @param _platformFeeBasisPoints The platform fee basis points
     * @notice The platform fee basis points must be less than 10000
     * @notice The fee to address must not be the zero address
     */
    constructor(
        address _feeTo,
        uint256 _platformFeeBasisPoints,
        address _verifier
    ) {
        require(
            _platformFeeBasisPoints < BASIS_POINTS,
            "Invalid platform fee basis points"
        );
        require(_feeTo != address(0), "Invalid fee to address");

        feeTo = _feeTo;
        verifier = _verifier;
        platformFeeBasisPoints = _platformFeeBasisPoints;
    }

    /**
     * @dev Set the fee to address
     * @param _feeTo The address to receive the platform fee
     * @notice The fee to address must not be the zero address
     */
    function setFeeTo(address _feeTo) external onlyOwner {
        require(_feeTo != address(0), "Invalid fee to address");
        feeTo = _feeTo;
        emit FeeToAddressSet(_feeTo);
    }

    /**
     * @dev Set the platform fee basis points
     * @param _platformFeeBasisPoints The platform fee basis points
     * @notice The platform fee basis points must be less than 10000
     */
    function setPlatformFeeBasisPoints(
        uint256 _platformFeeBasisPoints
    ) external onlyOwner {
        require(
            _platformFeeBasisPoints < BASIS_POINTS,
            "Invalid platform fee basis points"
        );
        platformFeeBasisPoints = _platformFeeBasisPoints;
        emit PlatformFeeBasisPointsSet(_platformFeeBasisPoints);
    }

    /**
     * @dev Initiates a payment to a merchant with verified signature and details
     * If the payment is valid, fees are deducted and the payment is processed.
     *
     * @param _sessionId The ID of the payment session.
     * @param _merchant The address of the merchant receiving the payment.
     * @param _token The address of the token used for payment.
     * @param _amount The amount of tokens or Ether being paid.
     * @param _deadline The expiration time for the provided signature.
     * @param signature The signature provided by the payer.
     */
    function pay(
        uint256 _sessionId,
        address _merchant,
        address _token,
        uint256 _amount,
        uint256 _deadline,
        bytes memory signature
    ) external payable {
        require(
            invalidSignatures[signature] == false &&
                verifyPayment(
                    _sessionId,
                    _merchant,
                    msg.sender,
                    _token,
                    _amount,
                    _deadline,
                    signature
                ),
            "Invalid signature"
        );
        uint256 feeAmount = (_amount * platformFeeBasisPoints) / BASIS_POINTS;
        if (_token == address(0)) {
            require(msg.value == _amount, "Invalid price");
            payable(feeTo).sendValue(feeAmount);
            payable(_merchant).sendValue(_amount - feeAmount);
        } else {
            IERC20(_token).transferFrom(msg.sender, feeTo, feeAmount);
            IERC20(_token).transferFrom(
                msg.sender,
                _merchant,
                _amount - feeAmount
            );
        }

        emit Payment(_sessionId, _merchant, _token, _amount);
    }

    /**
     * @dev Verifies the validity of a payment signature.
     *
     * @param _sessionId The ID of the payment session.
     * @param _merchant The address of the merchant receiving the payment.
     * @param _sender The address of the customer.
     * @param _token The address of the token used for payment.
     * @param _amount The amount of tokens being paid.
     * @param _deadline The expiration time for the provided signature.
     * @param signature The signature provided by the payer.
     * @return A boolean indicating whether the payment is valid or not.
     */
    function verifyPayment(
        uint256 _sessionId,
        address _merchant,
        address _sender,
        address _token,
        uint256 _amount,
        uint256 _deadline,
        bytes memory signature
    ) private view returns (bool) {
        bytes32 dataHash = encodePayment(
            _sessionId,
            _merchant,
            _sender,
            _token,
            _amount,
            _deadline
        );
        bytes32 signHash = ECDSA.toEthSignedMessageHash(dataHash);
        address recovered = ECDSA.recover(signHash, signature);
        return recovered == verifier;
    }

    /**
     * @dev Generates a unique hash representing payment details, including the session ID, merchant address,
     * sender's address, token address, payment amount, and signature expiration time.
     *
     * @param _sessionId The ID of the payment session.
     * @param _merchant The address of the merchant receiving the payment.
     * @param _sender The address of the customer initiating the payment.
     * @param _token The address of the token used for payment.
     * @param _amount The amount of tokens being paid.
     * @param _deadline The expiration time for the provided signature.
     * @return A bytes32 hash representing the encoded payment details.
     */
    function encodePayment(
        uint256 _sessionId,
        address _merchant,
        address _sender,
        address _token,
        uint256 _amount,
        uint256 _deadline
    ) private view returns (bytes32) {
        uint256 id;
        assembly {
            id := chainid()
        }
        return
            keccak256(
                abi.encode(
                    id,
                    _sessionId,
                    _merchant,
                    _sender,
                    _token,
                    _amount,
                    _deadline
                )
            );
    }

    /**
     * @dev function to set verifier address
     * @param _verifier new verifier address
     */
    function setVerifier(address _verifier) external onlyOwner {
        address oldVerifier = verifier;
        require(
            _verifier != address(0),
            "Set to zero address"
        );
        require(
            _verifier != oldVerifier,
            "verifier address set"
        );
        verifier = _verifier;
        emit VerifierAddressChanged(oldVerifier, _verifier);
    }
}
