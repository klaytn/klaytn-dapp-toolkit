import { ethers } from "hardhat";
import { PrivateSale, PrivateSale__factory } from "../../typechain-types";
import ca from "./cache/contract.json";
import { utils } from "ethers";
import { decodeLogPrivateSale } from "./utils";

async function main() {
  const deployer = (await ethers.getSigners())[0];
  const amount = utils.parseEther("1");
  const privateSale: PrivateSale = PrivateSale__factory.connect(
    ca.address,
    deployer
  );
  const tx = await (
    await privateSale.connect(deployer).contribute({ value: amount })
  ).wait();
  console.log(decodeLogPrivateSale(tx.logs[0]));
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
