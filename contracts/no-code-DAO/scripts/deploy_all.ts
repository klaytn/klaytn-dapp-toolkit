import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
import {
    AccountBalanceQuery,
    AccountId,
    AccountInfoQuery,
    Client,
    ContractCallQuery,
    ContractCreateFlow,
    ContractCreateTransaction,
    ContractExecuteTransaction,
    ContractFunctionParameters,
    FileCreateTransaction,
    Hbar,
    PrivateKey,
} from "@hashgraph/sdk";
const ethers = hre.ethers;
const upgrades = hre.upgrades;
import * as template from "../artifacts/contracts/GovernorTemplates/StandardGovernor.sol/StandardGovernor.json";

async function main() {
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    const verifier = await accounts[0].getAddress();

    const StandardGovernorFactory = await ethers.getContractFactory(
        "StandardGovernor",
    );
    const standardGovernor = await StandardGovernorFactory.deploy();

    const ERC20VotesStandardFactory = await ethers.getContractFactory(
        "ERC20VotesStandard",
    );
    const voteToken = await ERC20VotesStandardFactory.deploy();

    const GovernorFactory = await ethers.getContractFactory("GovernorFactory");

    const TimelockControllerFactory = await ethers.getContractFactory(
        "TimelockController",
    );

    const timelock = await TimelockControllerFactory.deploy();
    await timelock.deployed();

    const governorFactory = await upgrades.deployProxy(
        GovernorFactory,
        [timelock.address],
        {
            kind: "uups",
        },
    );

    await governorFactory.deployed();
    console.log("governorFactory deployed at:", governorFactory.address);
    console.log(
        "governorFactory implementation deployed at,",
        await upgrades.erc1967.getImplementationAddress(
            governorFactory.address,
        ),
    );
    await governorFactory.addGovernorPreset(
        "SimpleGovernor",
        standardGovernor.address,
    );

    await governorFactory.addVoteTokenPreset(
        "SimpleVoteToken",
        voteToken.address,
    );

    const contractAddress = {
        governor: governorFactory.address,
        implementation: await upgrades.erc1967.getImplementationAddress(
            governorFactory.address,
        ),
        timelock: timelock.address,
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
