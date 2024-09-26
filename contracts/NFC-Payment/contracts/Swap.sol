// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ISwap} from "./interfaces/ISwap.sol";

contract Swap {
    // mapping token used by Swap Contract
    mapping(address => bool) private tokenList;
    // mapping current liquidity of token
    mapping(address => uint256) private liquidity;
    address public tokenIn;
    address public tokenOut;

    constructor(address _tokenIn, address _tokenOut) {
        tokenIn = _tokenIn;
        tokenOut = _tokenOut;
    }

    function swap(
        address _tokenIn,
        address _tokenOut,
        uint256 amountIn
    ) external {
        uint256 amountOut;
        amountOut = amountIn;
        require(IERC20(_tokenOut).balanceOf(address(this)) >= amountOut, "Not enough liquidity");
        IERC20(_tokenIn).transfer(address(this), amountIn);
        IERC20(_tokenOut).transfer(msg.sender, amountIn);
    }
}
