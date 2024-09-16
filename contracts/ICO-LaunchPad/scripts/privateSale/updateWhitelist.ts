import { ethers } from "hardhat";
import { PrivateSale, PrivateSale__factory } from "../../typechain-types";
import ca from "./cache/contract.json";

async function main() {
  const deployer = (await ethers.getSigners())[0];
  const whiteList = [deployer.address];
  const privateSale: PrivateSale = PrivateSale__factory.connect(
    ca.address,
    deployer
  );
  const tx = await (
    await privateSale.updateWhitelist(
      whiteList,
      whiteList.map((e) => true)
    )
  ).wait();
  console.log(tx);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
