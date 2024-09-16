import { ethers } from "hardhat";
import { PrivateSale, PrivateSale__factory } from "../../typechain-types";
import ca from "./cache/contract.json";
import { utils } from "ethers";
import { decodeLogPrivateSale } from "./utils";

async function main() {
  const deployer = (await ethers.getSigners())[0];
  const privateSale: PrivateSale = PrivateSale__factory.connect(
    ca.address,
    deployer
  );
  console.log(
    "Current rate: ",
    await privateSale.currentRate,
    "Tokens",
    "= 1 NATIVE"
  );
  console.log(
    "Your contributed: ",
    utils.formatEther(await privateSale.contributions(privateSale.address)),
    "NATIVE"
  );
  const tx = await (await privateSale.claimTokens()).wait();
  console.log(tx);
  console.log(decodeLogPrivateSale(tx.logs[2]));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
