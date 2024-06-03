import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet, providers } from "ethers";
import { ethers } from "hardhat";
import { exportWallets } from "./utils/exportWallet";
import { exportContract } from "./utils/exportContract";
import { setTimeout } from "timers/promises";

async function main() {
  const deployer = (await ethers.getSigners())[0];

  const TAX_RECEIVER = ethers.Wallet.createRandom();
  const SEED_RECEIVER = ethers.Wallet.createRandom();
  const PRESALE_RECEIVER = ethers.Wallet.createRandom();
  const LIQUIDITY_RECEIVER = ethers.Wallet.createRandom();
  const CEX_RECEIVER = ethers.Wallet.createRandom();
  const MARKETING_RECEIVER = ethers.Wallet.createRandom();
  const RESEARCH_RECEIVER = ethers.Wallet.createRandom();
  const STACKING_RECEIVER = ethers.Wallet.createRandom();

  const totalSupply = "1000000000000000000000000000";
  const taxRate = 3;
  exportWallets({
    TAX_RECEIVER,
    SEED_RECEIVER,
    PRESALE_RECEIVER,
    LIQUIDITY_RECEIVER,
    CEX_RECEIVER,
    MARKETING_RECEIVER,
    RESEARCH_RECEIVER,
    STACKING_RECEIVER,
  });

  const deployToken = await ethers.getContractFactory("Token", deployer);
  const token = await deployToken.deploy(
    "VERB",
    "VERB",
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
  exportContract({
    address: token.address,
    args: [
      "VERB",
      "VERB",
      totalSupply,
      taxRate,
      TAX_RECEIVER.address,
      SEED_RECEIVER.address,
      PRESALE_RECEIVER.address,
      LIQUIDITY_RECEIVER.address,
      CEX_RECEIVER.address,
      MARKETING_RECEIVER.address,
      RESEARCH_RECEIVER.address,
      STACKING_RECEIVER.address,
    ],
  });
  await token.deployed();
  await setTimeout(5000);
  console.log(`Contract deployed to ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
