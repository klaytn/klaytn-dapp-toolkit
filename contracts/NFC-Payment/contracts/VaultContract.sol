// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract VaultContract is Ownable, ReentrancyGuard {
    using Address for address payable;

    uint256 public constant VERSION = 1;
    address public verifier;

    // mapping used payment signature
    mapping(bytes => bool) private invalidSignatures;
    // mapping used exceed limit signature
    mapping(bytes => bool) private invalidReconfirmedSig;
    // mapping user current liquidity of token
    mapping(address => mapping(address => Liquidity)) public userLiquidity;
    struct Liquidity {
        uint256 balance;
        uint256 limit;
    }
    event VerifierAddressChanged(address oldAddress, address newAddress);
    // Event emitted when a user makes a deposit
    event Deposit(address indexed user, address indexed token, uint256 amount);

    // Event emitted when a user makes a withdrawal
    event Withdrawal(
        address indexed user,
        address indexed token,
        uint256 amount
    );
    event LimitSet(address indexed user, address indexed token, uint256 limit);

    // Event emitted when a Payment process made
    event Payment(
        uint256 indexed _sessionId,
        address indexed _pos,
        address _token,
        uint256 _amount,
        uint256 _deadline,
        address _payer
    );

    /**
     * @dev Constructor
     * @notice The verifier that verify user signature
     */
    constructor(address _verifier) {
        verifier = _verifier;
    }

    /**
     * @dev Processes a payment request from a Point of Sale (POS) contract to the Vault.
     *
     * @param sessionId The unique ID of the payment session.
     * @param pos The address of the POS contract requesting payment.
     * @param payer The address of the user initiating the payment.
     * @param token The address of the token used for the payment.
     * @param amount The amount of tokens accepted for the payment.
     * @param deadline The deadline by which the payment must be completed.
     * @param signature The cryptographic signature for payment verification.
     *
     * Requirements:
     * - The provided signature must be valid and not listed as invalid.
     * - The payment must be verified using the provided parameters.
     * - The payment deadline must not be exceeded.
     * - The Vault must have sufficient funds in the specified token.
     *
     * Effects:
     * - If the payment is in native ETH, the specified amount is sent to the POS.
     * - If the payment is in an ERC-20 token, the specified amount is transferred to the POS.
     * - Updates the user's liquidity balance by deducting the paid amount.
     *
     * Emits:
     * - Payment event containing session ID, POS address, token, and amount.
     *
     * @return The token and amount of the processed payment.
     */
    function pay(
        uint256 sessionId,
        address pos,
        address payer,
        address token,
        bool exceededLimit,
        uint256 amount,
        uint256 deadline,
        bytes memory signature,
        bytes memory reconfirmedSig
    ) external payable nonReentrant returns (address, uint256) {
        require(
            invalidSignatures[signature] == false &&
                verifyPayment(
                    sessionId,
                    pos,
                    payer,
                    token,
                    exceededLimit,
                    amount,
                    deadline,
                    signature
                ),
            "Invalid signature"
        );
        require(pos == msg.sender, "Caller not POS contract");
        require(deadline > block.timestamp, "Exceeded deadline");
        if (!exceededLimit) {
            require(
                amount <= userLiquidity[token][payer].limit,
                "Payment amount exceed limit"
            );
        } else {
            require(
                invalidReconfirmedSig[reconfirmedSig] == false &&
                    verifyReconfirmed(
                        sessionId,
                        pos,
                        payer,
                        amount,
                        deadline,
                        reconfirmedSig
                    ),
                "Invalid reconfirmed signature"
            );
        }

        uint256 fromTokenBalance = IERC20(token).balanceOf(address(this));
        require(
            fromTokenBalance >= amount,
            "You do not have enough funds for this payment"
        );

        if (token == address(0)) {
            require(msg.value == amount, "Invalid price");
            payable(pos).sendValue(amount);
        } else {
            IERC20(token).transfer(pos, amount);
        }

        userLiquidity[token][payer].balance -= amount;
        emit Payment(sessionId, pos, token, amount, deadline, payer);
        return (token, amount);
    }

    /**
     * @dev Allows a user to deposit funds into the Vault Contract.
     *
     * @param token The ERC-20 token or ETH to deposit.
     * @param amount The amount of tokens or ETH to deposit.
     */
    function deposit(
        IERC20 token,
        uint256 amount
    ) external payable nonReentrant {
        if (address(token) == address(0)) {
            require(msg.value == amount, "Invalid amount");
            payable(address(this)).sendValue(amount);
        } else {
            require(
                token.allowance(msg.sender, address(this)) >= amount,
                "User must approve amount"
            );
            IERC20(token).transferFrom(msg.sender, address(this), amount);
        }
        userLiquidity[address(token)][msg.sender].balance += amount;

        // Emit deposit event
        emit Deposit(msg.sender, address(token), amount);
    }

    /**
     * @dev Allows a user to withdraw funds from the Vault Contract.
     *
     * @param token The ERC-20 token or ETH to withdraw.
     * @param amount The amount of tokens or ETH to withdraw.
     */
    function withdraw(IERC20 token, uint256 amount) external nonReentrant {
        require(
            token.balanceOf(msg.sender) > amount,
            "Not enough funds to withdraw"
        );

        if (address(token) == address(0)) {
            payable(msg.sender).sendValue(amount);
        } else {
            IERC20(token).transferFrom(address(this), msg.sender, amount);
        }
        userLiquidity[address(token)][msg.sender].balance -= amount;

        // Emit withdrawal event
        emit Withdrawal(msg.sender, address(token), amount);
    }

    /**
     * @dev Sets a withdrawal limit for a user on a specific ERC-20 token.
     *
     * @param token The ERC-20 token for which the withdrawal limit is set.
     * @param limit The new withdrawal limit for the user.
     */
    function setLimit(IERC20 token, uint256 limit) external {
        // Ensure that the limit is greater than or equal to zero
        require(limit >= 0, "Limit must be non-negative");
        userLiquidity[address(token)][msg.sender].limit = limit;
        // Emit LimitSet event to log the change in withdrawal limit
        emit LimitSet(msg.sender, address(token), limit);
    }

    /**
     * @dev Verifies the validity of a payment signature.
     *
     * @param _sessionId The ID of the payment session.
     * @param _pos The address of the pos contract.
     * @param _sender The address of the customer.
     * @param _token The address of the token used for payment.
     * @param _amount The amount of tokens being paid.
     * @param _deadline The expiration time for the provided signature.
     * @param signature The signature provided by the payer.
     * @return A boolean indicating whether the payment is valid or not.
     */
    function verifyPayment(
        uint256 _sessionId,
        address _pos,
        address _sender,
        address _token,
        bool _exceededLimit,
        uint256 _amount,
        uint256 _deadline,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 dataHash = encodePayment(
            _sessionId,
            _pos,
            _sender,
            _token,
            _exceededLimit,
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
     * @param _pos The address of the merchant receiving the payment.
     * @param _sender The address of the customer initiating the payment.
     * @param _token The address of the token used for payment.
     * @param _amount The amount of tokens being paid.
     * @param _deadline The expiration time for the Payment request.
     * @return A bytes32 hash representing the encoded payment details.
     */
    function encodePayment(
        uint256 _sessionId,
        address _pos,
        address _sender,
        address _token,
        bool _exceededLimit,
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
                    _pos,
                    _sender,
                    _token,
                    _exceededLimit,
                    _amount,
                    _deadline
                )
            );
    }

    /**
     * @dev Generates a unique hash representing payment details, including the session ID, pos address,
     * sender's address, payment amount, and signature expiration time.
     *
     * @param _sessionId The ID of the payment session.
     * @param _pos The address of the merchant receiving the payment.
     * @param _sender The address of the customer initiating the payment.
     * @param _amount The amount of tokens being paid.
     * @param _deadline The expiration time for the Payment request.
     * @return A bytes32 hash representing the encoded reconfirmed details.
    */
    function encodeReconfirmed(
        uint256 _sessionId,
        address _pos,
        address _sender,
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
                    _pos,
                    _sender,
                    _amount,
                    _deadline
                )
            );
    }
    /**
     * @dev Verifies the validity of a reconfirmed signature.
     *
     * @param _sessionId The ID of the payment session.
     * @param _pos The address of the pos contract.
     * @param _sender The address of the customer.
     * @param _amount The amount of tokens being paid.
     * @param _deadline The expiration time for the provided signature.
     * @param signature The signature provided by the payer.
     * @return A boolean indicating whether the reconfirmation is valid or not.
     */
    function verifyReconfirmed(
        uint256 _sessionId,
        address _pos,
        address _sender,
        uint256 _amount,
        uint256 _deadline,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 dataHash = encodeReconfirmed(
            _sessionId,
            _pos,
            _sender,
            _amount,
            _deadline
        );
        bytes32 signHash = ECDSA.toEthSignedMessageHash(dataHash);
        address recovered = ECDSA.recover(signHash, signature);
        return recovered == _sender;
    }


    /**
     * @dev function to set verifier address
     * @param _verifier new verifier address
     */
    function setVerifier(address _verifier) external onlyOwner {
        address oldVerifier = verifier;
        require(_verifier != address(0), "Set to zero address");
        require(_verifier != oldVerifier, "verifier address set");
        verifier = _verifier;
        emit VerifierAddressChanged(oldVerifier, _verifier);
    }
}
