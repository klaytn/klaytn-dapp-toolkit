// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is ERC20, Ownable {
    uint256 public SEED_TOKENOMICS_PERCENT = 8;
    uint256 public PRESALE_TOKENOMICS_PERCENT = 15;
    uint256 public LIQUIDITY_TOKENOMICS_PERCENT = 22;
    uint256 public CEX_TOKENOMICS_PERCENT = 13;
    uint256 public MARKETING_TOKENOMICS_PERCENT = 13;
    uint256 public RESEARCH_TOKENOMICS_PERCENT = 14;
    uint256 public STACKING_TOKENOMICS_PERCENT = 15;

    address public TAX_RECEIVER;
    address public SEED_RECEIVER;
    address public PRESALE_RECEIVER;
    address public LIQUIDITY_RECEIVER;
    address public CEX_RECEIVER;
    address public MARKETING_RECEIVER;
    address public RESEARCH_RECEIVER;
    address public STACKING_RECEIVER;
 
    uint256 private _initialSupply;
    uint256 private _taxRate;
    uint8 private _decimals = 18;
    event TaxRateChanged(uint256 newRate);

    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        uint256 initialTaxRate,
        address _TAX_RECEIVER,
        address _SEED_RECEIVER,
        address _PRESALE_RECEIVER,
        address _LIQUIDITY_RECEIVER,
        address _CEX_RECEIVER,
        address _MARKETING_RECEIVER,
        address _RESEARCH_RECEIVER,
        address _STACKING_RECEIVER
    ) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply);
        _initialSupply = initialSupply;
        _taxRate = initialTaxRate;
        TAX_RECEIVER = _TAX_RECEIVER;
        SEED_RECEIVER = _SEED_RECEIVER;
        PRESALE_RECEIVER = _PRESALE_RECEIVER;
        LIQUIDITY_RECEIVER = _LIQUIDITY_RECEIVER;
        CEX_RECEIVER = _CEX_RECEIVER;
        MARKETING_RECEIVER = _MARKETING_RECEIVER;
        RESEARCH_RECEIVER = _RESEARCH_RECEIVER;
        STACKING_RECEIVER = _STACKING_RECEIVER;
    }
    function transfer(
        address recipient,
        uint256 amount
    ) public override returns (bool) {
        uint256 taxAmount = (amount * _taxRate) / 100;
        uint256 afterTaxAmount = amount - taxAmount;
        if (_msgSender() == TAX_RECEIVER) { 
            _transfer(_msgSender(), recipient, amount);
        }
        else {
            _transfer(_msgSender(), recipient, afterTaxAmount);
            _transfer(_msgSender(), TAX_RECEIVER, taxAmount);
        }
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public override returns (bool) {
        address spender = _msgSender();
        uint256 taxAmount = (amount * _taxRate) / 100;
        uint256 afterTaxAmount = amount - taxAmount;

        _spendAllowance(from, spender, amount);
        _transfer(from, to, afterTaxAmount);
        _transfer(from, TAX_RECEIVER, taxAmount);
        return true;
    }

    function tokenomicsTransfer() public returns (bool)  {
        _transfer(_msgSender(),SEED_RECEIVER, _initialSupply * SEED_TOKENOMICS_PERCENT / 100);
        _transfer(_msgSender(),PRESALE_RECEIVER, _initialSupply * PRESALE_TOKENOMICS_PERCENT / 100);
        _transfer(_msgSender(),LIQUIDITY_RECEIVER, _initialSupply * LIQUIDITY_TOKENOMICS_PERCENT / 100);
        _transfer(_msgSender(),CEX_RECEIVER, _initialSupply * CEX_TOKENOMICS_PERCENT / 100);
        _transfer(_msgSender(),MARKETING_RECEIVER, _initialSupply * MARKETING_TOKENOMICS_PERCENT / 100);
        _transfer(_msgSender(),RESEARCH_RECEIVER, _initialSupply * RESEARCH_TOKENOMICS_PERCENT / 100);
        _transfer(_msgSender(),STACKING_RECEIVER, _initialSupply * STACKING_TOKENOMICS_PERCENT / 100);
        return true;
    } 

    function taxRate() external view returns (uint256) {
        return _taxRate;
    }

    function changeTaxRate(uint256 newRate) public onlyOwner {
        _beforeTokenTaxRate(newRate);
        _taxRate = newRate;
        emit TaxRateChanged(newRate);
    }

    function _beforeTokenTaxRate(uint256 newRate) private pure {
        require(newRate > 0, "Tax must be positive");
        require(newRate < 10, "Tax must be <= 100");
    }

}
interface IUniswapV2Callee {
    function uniswapV2Call(address sender, uint amount0, uint amount1, bytes calldata data) external;
}

interface IUniswapV2ERC20 {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
}

interface IUniswapV2Factory {
    event PairCreated(address indexed token0, address indexed token1, address pair, uint);

    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPair(address tokenA, address tokenB) external view returns (address pair);
    function allPairs(uint) external view returns (address pair);
    function allPairsLength() external view returns (uint);

    function createPair(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}

interface IUniswapV2Pair {
    event Approval(address indexed owner, address indexed spender, uint value);
    event Transfer(address indexed from, address indexed to, uint value);

    function name() external pure returns (string memory);
    function symbol() external pure returns (string memory);
    function decimals() external pure returns (uint8);
    function totalSupply() external view returns (uint);
    function balanceOf(address owner) external view returns (uint);
    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint value) external returns (bool);
    function transfer(address to, uint value) external returns (bool);
    function transferFrom(address from, address to, uint value) external returns (bool);

    function DOMAIN_SEPARATOR() external view returns (bytes32);
    function PERMIT_TYPEHASH() external pure returns (bytes32);
    function nonces(address owner) external view returns (uint);

    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;

    event Mint(address indexed sender, uint amount0, uint amount1);
    event Burn(address indexed sender, uint amount0, uint amount1, address indexed to);
    event Swap(
        address indexed sender,
        uint amount0In,
        uint amount1In,
        uint amount0Out,
        uint amount1Out,
        address indexed to
    );
    event Sync(uint112 reserve0, uint112 reserve1);

    function MINIMUM_LIQUIDITY() external pure returns (uint);
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
    function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast);
    function price0CumulativeLast() external view returns (uint);
    function price1CumulativeLast() external view returns (uint);
    function kLast() external view returns (uint);

    function mint(address to) external returns (uint liquidity);
    function burn(address to) external returns (uint amount0, uint amount1);
    function swap(uint amount0Out, uint amount1Out, address to, bytes calldata data) external;
    function skim(address to) external;
    function sync() external;

    function initialize(address, address) external;
}

