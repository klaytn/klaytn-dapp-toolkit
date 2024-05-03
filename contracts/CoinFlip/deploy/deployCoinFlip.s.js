const { ethers, network } = require("hardhat");
const { verify } = require("../utils/verify");

const deploy = async () => {

    const args = ["0x6B4c0b11bd7fE1E9e9a69297347cFDccA416dF5F"]

    const CoinFlip = await ethers.deployContract("CoinFlip", args);
    console.log("Deploying contract...");
    await CoinFlip.waitForDeployment(6);
    console.log(`Contract Deployed to: ${CoinFlip.target}`)
    console.log(network.config)

    if (network.config.chainId === 1001 && process.env.KLAYTN_RPC) {
        await CoinFlip.waitForDeployment(6);
        await verify(CoinFlip.target, args)
    } else {
        console.log("Contract cannot be verified on Hardhat Network")
    }

    const sendVal = ethers.parseEther("1");
    const flip = await CoinFlip.flip(0, { value: sendVal });
    await flip.wait(3);
    console.log(`Flipped!`);
}

// Use Klaytn custom chain config to verify your contract

// This code is the same as the import statement, check the utils folder.

// const verify = async (contractAddress, args) => {
//     console.log("Verifying contract....")
//     try {
//         await run("verify:verify", {
//             address: contractAddress,
//             constructorArgs: args
//         })
//     } catch (error) {
//         if (error.message.toLowerCase().includes("already verified")) {
//             console.log("Already verified...!")
//         } else {
//             console.log(error);
//         }
//     }
// }

deploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
