import { Contract } from "ethers";
import { Token, Token__factory } from "../typechain-types";
import ca from "./cache/contract.json";
import wallets from "./cache/wallets.json";
import { ethers } from "hardhat";
async function main() {
  const deployer = (await ethers.getSigners())[0];
  const token: Token = Token__factory.connect(ca.address, deployer);
  const PRESALE_RECEIVER = await token.PRESALE_RECEIVER();
  const PRESALE_TOKENOMICS_PERCENT = await token.PRESALE_TOKENOMICS_PERCENT();
  const balance = await token.balanceOf(deployer.address);
  const tx = await token.transfer(
    PRESALE_RECEIVER,
    balance.mul(PRESALE_TOKENOMICS_PERCENT).div(100)
  );
  console.log(await tx.wait());
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
