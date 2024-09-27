// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    constructor() ERC20("Mock Token", "USDT") {
    }


    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }
}
