import * as hre from "hardhat";
import * as fs from "fs";
import { Signer } from "ethers";
const ethers = hre.ethers;
import { Config } from "./config";

import { ERC20Token__factory, POS__factory, VaultContract__factory, Swap__factory, ERC20Token, POS, Swap, VaultContract } from "../typechain-types";

async function main() {
    const delay = () => new Promise(resolve => setTimeout(resolve, 5000));
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const admin = await accounts[0].getAddress();
    //Loading contracts' factory

    const MockERC20: ERC20Token__factory = await ethers.getContractFactory(
        "ERC20Token",
    );
    const POS: POS__factory = await ethers.getContractFactory(
        "POS",
    );
    const Vault: VaultContract__factory = await ethers.getContractFactory(
        "VaultContract",
    );
    const Swap: Swap__factory = await ethers.getContractFactory(
        "Swap",
    );

    // Deploy contracts
    console.log(
        "==================================================================",
    );
    console.log("DEPLOY CONTRACTS",);
    console.log(
        "==================================================================",
    );

    console.log("ACCOUNT: " + admin);

    const tokenIn: ERC20Token = await MockERC20.deploy();
    await tokenIn.deployed();
    await delay();
    const tokenOut: ERC20Token = await MockERC20.deploy();
    await tokenOut.deployed();
    await delay();
    const swap: Swap = await Swap.deploy(tokenIn.address, tokenOut.address);
    await swap.deployed();
    await delay();
    const pos: POS = await POS.deploy(swap.address);
    await pos.deployed();
    await delay();
    const vault: VaultContract = await Vault.deploy(admin);
    await vault.deployed();

    console.log("TokenIn deployed at: ", tokenIn.address);
    console.log("TokenOut deployed at: ", tokenOut.address);
    console.log("Swap deployed at: ", swap.address);
    console.log("POS deployed at: ", pos.address);
    console.log("Vault deployed at: ", vault.address);
   
    const contractAddress = {
        tokenIn: tokenIn.address,
        tokenOUt: tokenOut.address,
        swap: swap.address,
        POS: pos.address,
        Vault: vault.address,
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


async function signaturePayment(
    sessionId: number,
    pos: string,
    sender: string,
    token: string,
    exceededLimit: boolean,
    amount: number,
    deadline: number,
) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodePaymendData(
        chainId,
        sessionId,
        pos,
        sender,
        token,
        exceededLimit,
        amount,
        deadline,
    );
    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    let wallet = new ethers.Wallet(
        "669eaf3f8394c7fc0329a06c9b1f90813d3c4a8aef128f3f27b61ffa3aa007e8",
    );

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

function encodePaymendData(
    chainId: number,
    sessionId: number,
    pos: string,
    sender: string,
    token: string,
    exceededLimit: boolean,
    amount: number,
    deadline: number,
) {
    const payload = ethers.utils.defaultAbiCoder.encode(
        [
            "uint256",
            "uint256",
            "address",
            "address",
            "address",
            "bool",
            "uint256",
            "uint256",
        ],
        [chainId, sessionId, pos, sender, token, exceededLimit, amount, deadline],
    );
    return ethers.utils.keccak256(payload);
}
