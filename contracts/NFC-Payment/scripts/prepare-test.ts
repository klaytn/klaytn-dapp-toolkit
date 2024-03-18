import * as hre from "hardhat";
import * as fs from "fs";
import { Signer, Wallet } from "ethers";
const ethers = hre.ethers;
import { Config } from "./config";

import { ERC20Token__factory, POS__factory, VaultContract__factory, Swap__factory, ERC20Token, POS, Swap, VaultContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
    const delay = () => new Promise(resolve => setTimeout(resolve, 10000));
    //import user wallet
    const accounts: Signer[] = await ethers.getSigners();
    const user = accounts[1];


    const POS: POS__factory = await ethers.getContractFactory(
        "POS",
    );
    const Vault: VaultContract__factory = await ethers.getContractFactory(
        "VaultContract",
    );
    const vault = await Vault.attach("0x0731fE55F95B5b986F4EBd187315fB1F4C823b94");
    const pos = await POS.attach("0x0DBb0069A7684E2DB1b9962F22Afdc6eB61F43b0");

    //mint token in for user and swap contract
    const MockERC20: ERC20Token__factory = await ethers.getContractFactory(
        "ERC20Token",
    );
    const tokenIn = MockERC20.attach("0xfC0E0C9E263C46935bC684511D8A249c68334702");
    // await tokenIn.mint(signer_wallet.address, 10000);
    // await delay();
    // await tokenIn.mint("0x8aB386e5507c0B97a9b398641F0C3d6D90bD82B8", 10000);
    // await delay();
    //mint token out for swap contract
    // const tokenOut = MockERC20.attach("0x88A354BB91d1F89B19B3b32601202DA4585A7e54");
    // await tokenOut.mint("0x8aB386e5507c0B97a9b398641F0C3d6D90bD82B8", 10000)
    // await delay();

    //user deposit to vault
    // const fragment = tokenIn.interface.getFunction("approve")
    // const selectorHash = tokenIn.interface.getSighash(fragment)
    // let tx = {
    //     to: "0xfC0E0C9E263C46935bC684511D8A249c68334702",
    //     value: 0,
    //     data: ethers.utils.solidityPack(["bytes4", "address", "uint256"], [selectorHash, "0x0731fE55F95B5b986F4EBd187315fB1F4C823b94", 1000])
    // }

    // await user.sendTransaction(tx)
    // await tokenIn.connect(user).approve("0x0731fE55F95B5b986F4EBd187315fB1F4C823b94", 1000)
    // await delay();

    await vault.connect(user).deposit("0xfC0E0C9E263C46935bC684511D8A249c68334702", 1000);
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

async function signatureReconfimation(
    sessionId: number,
    pos: string,
    sender: string,
    amount: number,
    deadline: number,
    user: Signer
) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodeReconfimedData(
        chainId,
        sessionId,
        pos,
        sender,
        amount,
        deadline,
    );
    // 32 bytes of data in Uint8Array
    let messageHashBinary = ethers.utils.arrayify(messageHash);

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await user.signMessage(messageHashBinary);
    return signature;
}

function encodeReconfimedData(
    chainId: number,
    sessionId: number,
    pos: string,
    sender: string,
    amount: number,
    deadline: number,
) {
    const payload = ethers.utils.defaultAbiCoder.encode(
        [
            "uint256",
            "uint256",
            "address",
            "address",
            "uint256",
            "uint256",
        ],
        [chainId, sessionId, pos, sender, amount, deadline],
    );
    return ethers.utils.keccak256(payload);
}