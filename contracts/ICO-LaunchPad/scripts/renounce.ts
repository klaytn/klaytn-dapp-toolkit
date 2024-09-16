import { Contract } from "ethers";
import { Token, Token__factory } from "../typechain-types";
import ca from "./cache/contract.json";
import wallets from "./cache/wallets.json";
import { ethers } from "hardhat";
async function main() {
  const deployer = (await ethers.getSigners())[0];
  const token: Token = Token__factory.connect(ca.address, deployer);
  const tx = await token.connect(deployer).renounceOwnership();
  console.log(tx.hash);
  await tx.wait();
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
