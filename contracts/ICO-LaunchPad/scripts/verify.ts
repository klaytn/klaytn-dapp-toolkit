import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Wallet, providers } from "ethers";
import { ethers } from "hardhat";
import { exportWallets } from "./utils/exportWallet";
import wallets from "./cache/wallets.json";
import ca from "./cache/contract.json";
import { exec } from "child_process";
async function main() {
  const cmd = `npx hardhat verify --network bsc ${ca.address} ${
    (ca as any)?.args?.join(" ") || ""
  }`;
  console.log(cmd);
  await exec(cmd);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
