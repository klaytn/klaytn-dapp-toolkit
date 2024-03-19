import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;

import { CrPayment__factory, CrPayment } from "../typechain-types";

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    const verifier = await accounts[0].getAddress();
    //Loading contracts' factory

    const CrPayment: CrPayment__factory = await ethers.getContractFactory(
        "CrPayment",
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

    const crPayment: CrPayment = await CrPayment.deploy(admin, 100, verifier);
    await crPayment.waitForDeployment();

    const crPaymentAddress = await crPayment.getAddress();

    console.log("CrPayment deployed at: ", crPaymentAddress);

    const contractAddress = {
        crPayment: crPaymentAddress,
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
