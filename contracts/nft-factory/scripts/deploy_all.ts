import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;
const upgrades = hre.upgrades;

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    //Loading contracts' factory
    const NFTFactory = await ethers.getContractFactory("NFT");
    const NFTFactoryFactory = await ethers.getContractFactory("NFTFactory");

    // Deploy contracts
    console.log(
        "==================================================================",
    );
    console.log("DEPLOY CONTRACTS");
    console.log(
        "==================================================================",
    );

    console.log("ACCOUNT: " + admin);

    const nft = await NFTFactory.deploy();
    await nft.waitForDeployment();

    const nftAddress = await nft.getAddress();

    const nftFactory = await upgrades.deployProxy(NFTFactoryFactory, [
        nftAddress,
    ]);

    await nftFactory.waitForDeployment();

    const nftFactoryProxyAddress = await nftFactory.getAddress();
    const nftFactoryImplementation =
        await upgrades.erc1967.getImplementationAddress(nftFactoryProxyAddress);

    console.log("NFT Factory: " + nftFactoryProxyAddress);

    const contractAddress = {
        nftAddress: nftAddress,
        nftFactory: nftFactoryProxyAddress,
        nftFactoryImplementation: nftFactoryImplementation,
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
