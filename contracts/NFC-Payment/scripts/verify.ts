import * as hre from "hardhat";
import * as contracts from "../contracts.json";
import { SwapConfig, POSConfig, VaultConfig } from "./config";

async function main() {
    try {
        await hre.run("verify:verify", {
            address: contracts.tokenIn,
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }
    try {
        await hre.run("verify:verify", {
            address: contracts.tokenOUt,
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }
    try {
        await hre.run("verify:verify", {
            address: contracts.swap,
            constructorArguments: [SwapConfig.tokenIn, SwapConfig.tokenOUt],
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }
    try {
        await hre.run("verify:verify", {
            address: contracts.POS,
            constructorArguments: [POSConfig.swap],
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }
    try {
        await hre.run("verify:verify", {
            address: contracts.Vault,
            constructorArguments: [VaultConfig.admin],
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
