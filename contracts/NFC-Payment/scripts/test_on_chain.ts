import * as hre from "hardhat";
import * as fs from "fs";
import { Signer, Wallet } from "ethers";
const ethers = hre.ethers;
import { Config } from "./config";

import { ERC20Token__factory, POS__factory, VaultContract__factory, Swap__factory, ERC20Token, POS, Swap, VaultContract } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

async function main() {
    const delay = () => new Promise(resolve => setTimeout(resolve, 10000));
    //Loading accounts
    const accounts: Signer[] = await ethers.getSigners();
    const user = await accounts[0].getAddress();
    //import user wallet
    const provider = hre.ethers.provider;
    const signer_wallet = new Wallet("b6d51d89f7c9bdeafebc8ad6b3c6cd208895a1947997024c4a4950e8845dcd8a");
    const signer = await signer_wallet.connect(provider);


    const POS: POS__factory = await ethers.getContractFactory(
        "POS",
    );
    const Vault: VaultContract__factory = await ethers.getContractFactory(
        "VaultContract",
    );
    const vault = await Vault.attach("0x0731fE55F95B5b986F4EBd187315fB1F4C823b94");
    const pos = await POS.attach("0x0DBb0069A7684E2DB1b9962F22Afdc6eB61F43b0");

    //FE should start here
    //create signature
    //mock payment data
    const data = {
        sessionId: 1,
        pos: "0x0DBb0069A7684E2DB1b9962F22Afdc6eB61F43b0",
        sender: "0xbff47Cca2C5b889d2E75E58C0639e2Ae497E5f5c",
        token: "0xfC0E0C9E263C46935bC684511D8A249c68334702",
        limit: true,
        amount: 101,
        deadline: 1703702392
    }
    //first signature
    const signature: string = await signaturePayment(
        data.sessionId,
        data.pos,
        data.sender,
        data.token,
        data.limit,
        data.amount,
        data.deadline
    );
    console.log(await vault.verifyPayment(data.sessionId, data.pos, data.sender, data.token, data.limit, data.amount, data.deadline, signature))
    //reconfirmed signature (exceed limit)
    const reconfirmedSig = await signatureReconfimation(
        data.sessionId,
        data.pos,
        data.sender,
        data.amount,
        data.deadline,
        signer
    );
    console.log(await vault.verifyReconfirmed(data.sessionId, data.pos, data.sender, data.amount, data.deadline, reconfirmedSig))
    //encode data for params in requestPayfunction
    const paymentData = await Vault.interface.encodeFunctionData(
        "pay",
        [
            data.sessionId,
            data.pos,
            data.sender,
            data.token,
            data.limit,
            data.amount,
            data.deadline,
            signature,
            reconfirmedSig
        ]
    )
    console.log(paymentData)
    await pos.requestPayment(
        data.sessionId,
        paymentData,
        "0x0731fE55F95B5b986F4EBd187315fB1F4C823b94", //vault address
        "0xfC0E0C9E263C46935bC684511D8A249c68334702" //payment token that pos chose
    )
    console.log("sessionId: " + data.sessionId)
    console.log("paymentData: " + paymentData)
    console.log("vault: " + "0xA43A0bC0E9F0C47eeEe7453916E6D91DEcB58c80")
    console.log("tokenOut: " + "0xfC0E0C9E263C46935bC684511D8A249c68334702")
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