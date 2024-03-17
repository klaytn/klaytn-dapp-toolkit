import { BigNumber, Contract, constants, utils } from "ethers";
import { ethers } from "hardhat";
import {
  PrivateSale,
  PrivateSale__factory,
  Token,
  Token__factory,
} from "../typechain-types";

import { Log } from "@ethersproject/providers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import factoryArtifact from "@uniswap/v2-core/build/UniswapV2Factory.json";
import pairArtifact from "@uniswap/v2-periphery/build/IUniswapV2Pair.json";
import routerArtifact from "@uniswap/v2-periphery/build/UniswapV2Router02.json";
import { expect } from "chai";
import { testBuyToken, testSellToken } from "./utils";

const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const FACTORY_ADDRESS = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
var fs = require("fs");
console.log(utils.parseEther("2").toString());
describe("Contract", function () {
  let signers: SignerWithAddress[],
    deployer: SignerWithAddress,
    TAX_RECEIVER: SignerWithAddress,
    SEED_RECEIVER: SignerWithAddress,
    PRESALE_RECEIVER: SignerWithAddress,
    LIQUIDITY_RECEIVER: SignerWithAddress,
    CEX_RECEIVER: SignerWithAddress,
    MARKETING_RECEIVER: SignerWithAddress,
    RESEARCH_RECEIVER: SignerWithAddress,
    STACKING_RECEIVER: SignerWithAddress,
    address1: SignerWithAddress,
    address2: SignerWithAddress,
    address3: SignerWithAddress,
    deployICO: PrivateSale__factory,
    deployToken: Token__factory,
    token: Token,
    privateSale: PrivateSale,
    dexFactory: Contract,
    dexRouter: Contract,
    dexPair: Contract,
    totalSupply = "1000000000000000000000000000",
    totalSupplyNumber = Number(
      BigNumber.from(totalSupply).div(BigNumber.from(10).pow(18))
    ),
    taxRate: number = 1;
  it("Should deploy (not include Uniswap)", async function () {
    signers = await ethers.getSigners();
    deployer = signers[0];
    TAX_RECEIVER = signers[1];
    SEED_RECEIVER = signers[2];
    PRESALE_RECEIVER = signers[3];
    LIQUIDITY_RECEIVER = signers[4];
    CEX_RECEIVER = signers[5];
    MARKETING_RECEIVER = signers[6];
    RESEARCH_RECEIVER = signers[7];
    STACKING_RECEIVER = signers[8];
    address1 = signers[9];
    address2 = signers[10];
    address3 = signers[11];
    console.log("Deployer: ", deployer.address);
    dexFactory = new Contract(FACTORY_ADDRESS, factoryArtifact.abi, deployer);
    await dexFactory.deployed();
    dexRouter = new Contract(ROUTER_ADDRESS, routerArtifact.abi, deployer);
    await dexRouter.deployed();

    deployToken = await ethers.getContractFactory("Token", deployer);
    deployICO = await ethers.getContractFactory("PrivateSale", deployer);

    token = await deployToken.deploy(
      "test",
      "TEST",
      totalSupply,
      taxRate,
      TAX_RECEIVER.address,
      SEED_RECEIVER.address,
      PRESALE_RECEIVER.address,
      LIQUIDITY_RECEIVER.address,
      CEX_RECEIVER.address,
      MARKETING_RECEIVER.address,
      RESEARCH_RECEIVER.address,
      STACKING_RECEIVER.address
    );

    await token.deployed();
    privateSale = await deployICO.deploy(token.address, utils.parseEther("1"));
    console.log(`Contract: ${await token.address}`);
    expect(await token.owner()).to.equal(deployer.address);
    expect(await token.totalSupply()).to.equal(
      await token.balanceOf(deployer.address)
    );
  });
  const getRate = async () => {
    const Rquote = await ethers.provider.getBalance(privateSale.address);
    const Rbase = await token.balanceOf(privateSale.address);
    const currentRate = Rbase.div(Rquote);
    return Number(currentRate);
  };
  const decodeLog = (log: Log) => {
    const iface = new ethers.utils.Interface(PrivateSale__factory.abi);
    return iface.parseLog(log).args;
  };
  it("Start private sale", async function () {
    await (await privateSale.startICO(1000)).wait(); // 1000 blocknumber
    // const Rbase = await token.balanceOf(privateSale.address);
    // const Rquote = await ethers.provider.getBalance(privateSale.address);
    expect(await privateSale.icoActive()).to.equal(true);
  });
  it("add to whiteList", async function () {
    const tx = await (
      await privateSale.updateWhitelist(
        [address1.address, address2.address, deployer.address],
        [true, true, true]
      )
    ).wait();
    console.log('Add whitelist ICO - tx', tx.transactionHash)
    try {
      const tx1 = await (
        await privateSale.connect(address3).contribute(MARKETING_RECEIVER.address,{
          value: utils.parseEther("1"),
        })
      ).wait();
    } catch (error) {
      console.log("Whitelist not allow");
    }
  });
  it("Contribute after start ICO", async function () {
    const baseAmount = BigNumber.from(totalSupply)
      .mul(await token.SEED_TOKENOMICS_PERCENT())
      .div(100);
    await (await token.transfer(privateSale.address, baseAmount)).wait();
    const tx1 = await (
      await privateSale.contribute(MARKETING_RECEIVER.address, { value: utils.parseEther("1") })
    ).wait();
    const currentRate = await getRate();

    const tx2 = await (
      await privateSale
        .connect(address1)
        .contribute(MARKETING_RECEIVER.address,{ value: utils.parseEther("0.5") })
    ).wait();
    const currentRate2 = await getRate();

    const tx3 = await (
      await privateSale
        .connect(address2)
        .contribute(MARKETING_RECEIVER.address,{ value: utils.parseEther("0.25") })
    ).wait();
    const currentRate3 = await getRate();
    console.log("Contribute -> 1 NATIVE |", currentRate, "Tokens = 1 NATIVE");
    console.log(
      "Contribute -> 0.5 NATIVE |",
      currentRate2,
      "Tokens = 1 NATIVE"
    );
    console.log(
      "Contribute -> 0.25 NATIVE |",
      currentRate3,
      "Tokens = 1 NATIVE"
    );
    expect(utils.parseEther("1")).to.equal(decodeLog(tx1.logs[0]).amount);
    expect(utils.parseEther("0.5")).to.equal(decodeLog(tx2.logs[0]).amount);
    expect(utils.parseEther("0.25")).to.equal(decodeLog(tx3.logs[0]).amount);
  });
  it("Stop ICO", async function () {
    const tx = await (await privateSale.stopICO()).wait();
    console.log('Stop ICO - tx', tx.transactionHash)
  });
  it("Claim", async function () {
    const CRate = await getRate();
    const b1 = await token.balanceOf(deployer.address);
    const b2 = await token.balanceOf(address1.address);
    const b3 = await token.balanceOf(address2.address);
    const tx = await (await privateSale.claimTokens()).wait();
    console.log('#claim-tx1', tx.transactionHash)
    const tx2 = await (
      await privateSale.connect(address1).claimTokens()
    ).wait();
    console.log('#claim-tx2', tx2.transactionHash)

    const tx3 = await (
      await privateSale.connect(address2).claimTokens()
    ).wait();
    console.log('#claim-tx3', tx3.transactionHash)
    const bs1 = await token.balanceOf(deployer.address);
    const bs2 = await token.balanceOf(address1.address);
    const bs3 = await token.balanceOf(address2.address);

    expect(bs1).to.greaterThan(b1);
    expect(bs2).to.greaterThan(b2);
    expect(bs3).to.greaterThan(b3);

    console.log("Claim ->", Number(utils.formatEther(bs1.sub(b1))), "Tokens");
    console.log("Claim ->", Number(utils.formatEther(bs2.sub(b2))), "Tokens");
    console.log("Claim -> ", Number(utils.formatEther(bs3.sub(b3))), "Tokens");
  });
  it("withdraw", async function () {
    const b1 = await deployer.getBalance();
    const tx = await (await privateSale.withdraw()).wait();
    const b2 = await deployer.getBalance();
    console.log(
      "Withdraw -> ",
      Number(utils.formatEther(b2.sub(b1))),
      "NATIVE"
    );
    expect(b2).to.greaterThan(b1);
  });
  it("Create Pair Pancake V2", async function () {
    await (
      await dexFactory.connect(deployer).createPair(WETH_ADDRESS, token.address)
    ).wait();
    const pairAddress = await dexFactory.getPair(WETH_ADDRESS, token.address);
    dexPair = new Contract(pairAddress, pairArtifact.abi, deployer);
    await (
      await token
        .connect(deployer)
        .approve(dexRouter.address, constants.MaxUint256)
    ).wait();
    const ethAmount = utils.parseUnits("50");
    const tokenAmount = utils.parseUnits((0.8 * totalSupplyNumber).toString());
    const deadline = Math.floor(Date.now() / 1000 + 10 * 60);
    await (
      await dexRouter
        .connect(deployer)
        .addLiquidityETH(
          token.address,
          tokenAmount,
          0,
          0,
          deployer.address,
          deadline,
          {
            value: ethAmount,
          }
        )
    ).wait();
    expect(await token.balanceOf(dexPair.address)).to.equal(
      tokenAmount.mul(100 - taxRate).div(100)
    );
  });

  it("Allow Buy (allow Tax)", async function () {
    const amountETH = 10;
    await testBuyToken(dexRouter, token, address1, amountETH);
  });
  it("Allow Sell (allow Tax)", async function () {
    const currentBalance = await token.balanceOf(address1.address);
    await testSellToken(dexRouter, token, address1, currentBalance);
  });
  it("Renounce Ownership", async function () {
    await (await token.renounceOwnership()).wait();
    expect(await token.owner()).to.equal(ZERO_ADDRESS);
  });
});
