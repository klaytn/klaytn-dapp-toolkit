import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;
import { Config } from "./config";

import { CappedSet__factory, CappedSet } from "../typechain-types";

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    //Loading contracts' factory

    const CappedSet: CappedSet__factory = await ethers.getContractFactory(
        "CappedSet",
    );

    // Deploy contracts
    console.log(
        "==================================================================",
    );
    console.log("DEPLOY CONTRACTS");
    console.log(
        "==================================================================",
    );

    console.log("ACCOUNT: " + admin);

    const cappedSet: CappedSet = await CappedSet.deploy(Config.capacity);
    await cappedSet.waitForDeployment();

    const greaterAddress = await cappedSet.getAddress();

    console.log("cappedSet deployed at: ", greaterAddress);

    const contractAddress = {
        cappedSet: greaterAddress,
    };

    fs.writeFileSync("contracts.json", JSON.stringify(contractAddress));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
