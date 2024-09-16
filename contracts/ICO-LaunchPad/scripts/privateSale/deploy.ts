import { utils } from "ethers";
import { ethers } from "hardhat";
import { setTimeout } from "timers/promises";
import { address as ContractAddress } from "../cache/contract.json";
import { exportContract } from "../utils/exportContract";
async function main() {
  const deployer = (await ethers.getSigners())[0];
  const PrivateSaleFactory = await ethers.getContractFactory(
    "PrivateSale",
    deployer
  );
  const privateSale = await PrivateSaleFactory.deploy(
    ContractAddress,
    utils.parseEther("2")
  );
  await privateSale.deployed();

  exportContract(
    {
      address: privateSale.address,
      args: [ContractAddress, utils.parseEther("2")],
    },
    "scripts/privateSale/cache/contract.json"
  );
  await setTimeout(5000);
  console.log(`Contract privateSale deployed to ${privateSale.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
