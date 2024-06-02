import * as hre from "hardhat";
import * as contracts from "../contracts.json";

async function main() {
    try {
        await hre.run("verify:verify", {
            address: contracts.governor,
            constructorArguments: [],
            hre,
        });
    } catch (err) {
        console.log("err >>", err);
    }

    try {
        await hre.run("verify:verify", {
            address: contracts.timelock,
            constructorArguments: [],
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
