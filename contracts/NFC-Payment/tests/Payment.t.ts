import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import {
    POS__factory,
    Swap__factory,
    VaultContract__factory,
    POS,
    Swap,
    VaultContract,
    ERC20Token,
    ERC20Token__factory,
} from "../typechain-types";

describe("NFC", () => {
    let user: SignerWithAddress;
    let verifier: string;
    let POS: POS;
    let Swap: Swap;
    let VaultContract: VaultContract;
    let tokenIn: ERC20Token;
    let tokenOut: ERC20Token;
    let defaultBytes = "0x00"
    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        user = accounts[0];
        verifier = "0xda4a2C49912717bF4352449913Aa7052B25f9560";

        const POSFactory: POS__factory = await ethers.getContractFactory("POS");
        const SwapFactory: Swap__factory = await ethers.getContractFactory(
            "Swap",
        );
        const vaultContractFactory: VaultContract__factory =
            await ethers.getContractFactory("VaultContract");
        const ERC20: ERC20Token__factory = await ethers.getContractFactory(
            "ERC20Token",
        );
        tokenIn = await ERC20.deploy();
        tokenOut = await ERC20.deploy();
        Swap = await SwapFactory.deploy(tokenIn.address, tokenOut.address);
        POS = await POSFactory.deploy(Swap.address);
        VaultContract = await vaultContractFactory.deploy(verifier);
        await tokenIn.mint(Swap.address, 1000);
        await tokenIn.mint(user.address, 1000);
        await tokenOut.mint(Swap.address, 1000);
    });

    describe("Should pay successfully", () => {
        it("Should pay successfully when accept exceed limit and under limitation", async () => {
            // user deposit token to Vault, userLiquidity will be updated
            await tokenIn.connect(user).approve(VaultContract.address, 100);
            const tx1 = await VaultContract.connect(user).deposit(
                tokenIn.address,
                100,
            );
            //set payment limit for token
            await VaultContract.setLimit(tokenIn.address, 10)
            const userLiq = await VaultContract.userLiquidity(tokenIn.address, user.address);
            expect(userLiq.limit).to.equal(10);
            // console.log(
            //     await VaultContract.userLiquidity(
            //         tokenIn.address,
            //         user.address,
            //     ),
            // );

            //create signature and request payment
            let timestamp = (await ethers.provider.getBlock("latest"))
                .timestamp;

            const signature: string = await signaturePayment(
                1,
                POS.address,
                user.address,
                tokenIn.address,
                true,
                10,
                timestamp + 10000,
            );
            const reconfirmedSignature: string = await signatureReconfimation(
                1,
                POS.address,
                user.address,
                10,
                timestamp + 10000,
                user
            );
            // console.log(
            //     await VaultContract.verifyPayment(
            //         1,
            //         POS.address,
            //         user.address,
            //         tokenIn.address,
            //         true,
            //         10,
            //         timestamp + 10000,
            //         signature,
            //     ),
            // );
            // console.log(
            //     await VaultContract.verifyReconfirmed(
            //         1,
            //         POS.address,
            //         user.address,
            //         10,
            //         timestamp + 10000,
            //         reconfirmedSignature,
            //     ),
            // );
            const paymentData = VaultContract.interface.encodeFunctionData(
                "pay",
                [
                    1,
                    POS.address,
                    user.address,
                    tokenIn.address,
                    true,
                    10,
                    timestamp + 10000,
                    signature,
                    reconfirmedSignature
                ],
            );
            const tx2 = await POS.requestPayment(
                1,
                paymentData,
                VaultContract.address,
                tokenOut.address,
            );

            const newUserLiquidity = await VaultContract.userLiquidity(
                tokenIn.address,
                user.address,
            );
            expect(tx1).to.changeTokenBalance(tokenIn, user, -100);
            expect(tx2).to.changeTokenBalance(tokenOut, POS.address, 10);
            let receipt: any = await tx2.wait();
            console.log(receipt.events?.filter((x: any) => { return x.event == "sa" }));

            expect(newUserLiquidity.balance).to.equal(90);
        });

        it("Should pay successfully when accept exceed limit and over limitation", async () => {
            // user deposit token to Vault, userLiquidity will be updated
            // console.log(await tokenIn.balanceOf(user.address));
            await tokenIn.connect(user).approve(VaultContract.address, 100);
            const tx1 = await VaultContract.connect(user).deposit(
                tokenIn.address,
                100,
            );
            //set payment limit for token
            await VaultContract.setLimit(tokenIn.address, 10)
            const userLiq = await VaultContract.userLiquidity(tokenIn.address, user.address);
            expect(userLiq.limit).to.equal(10);
            // console.log(
            //     await VaultContract.userLiquidity(
            //         tokenIn.address,
            //         user.address,
            //     ),
            // );

            //create signature and request payment
            let timestamp = (await ethers.provider.getBlock("latest"))
                .timestamp;
            const signature: string = await signaturePayment(
                1,
                POS.address,
                user.address,
                tokenIn.address,
                true,
                20,
                timestamp + 10000,
            );
            const reconfirmedSignature: string = await signatureReconfimation(
                1,
                POS.address,
                user.address,
                20,
                timestamp + 10000,
                user
            );

            const paymentData = VaultContract.interface.encodeFunctionData(
                "pay",
                [
                    1,
                    POS.address,
                    user.address,
                    tokenIn.address,
                    true,
                    20,
                    timestamp + 10000,
                    signature,
                    reconfirmedSignature
                ],
            );

            const tx2 = await POS.requestPayment(
                1,
                paymentData,
                VaultContract.address,
                tokenOut.address,
            );

            const newUserLiquidity = await VaultContract.userLiquidity(
                tokenIn.address,
                user.address,
            );
            expect(tx1).to.changeTokenBalance(tokenIn, user, -100);
            expect(tx2).to.changeTokenBalance(tokenOut, POS.address, 20);
            expect(newUserLiquidity.balance).to.equal(80);
        });

        it("Should pay successfully when deny exceed limit and under limitation", async () => {
            // user deposit token to Vault, userLiquidity will be updated
            // console.log(await tokenIn.balanceOf(user.address));
            await tokenIn.connect(user).approve(VaultContract.address, 100);
            const tx1 = await VaultContract.connect(user).deposit(
                tokenIn.address,
                100,
            );
            //set payment limit for token
            await VaultContract.setLimit(tokenIn.address, 10)
            const userLiq = await VaultContract.userLiquidity(tokenIn.address, user.address);
            expect(userLiq.limit).to.equal(10);
            // console.log(
            //     await VaultContract.userLiquidity(
            //         tokenIn.address,
            //         user.address,
            //     ),
            // );

            //create signature and request payment
            let timestamp = (await ethers.provider.getBlock("latest"))
                .timestamp;
            const signature: string = await signaturePayment(
                1,
                POS.address,
                user.address,
                tokenIn.address,
                false,
                5,
                timestamp + 10000,
            );

            const paymentData = VaultContract.interface.encodeFunctionData(
                "pay",
                [
                    1,
                    POS.address,
                    user.address,
                    tokenIn.address,
                    false,
                    5,
                    timestamp + 10000,
                    signature,
                    defaultBytes
                ],
            );

            const tx2 = await POS.requestPayment(
                1,
                paymentData,
                VaultContract.address,
                tokenOut.address,
            );

            const newUserLiquidity = await VaultContract.userLiquidity(
                tokenIn.address,
                user.address,
            );
            expect(tx1).to.changeTokenBalance(tokenIn, user, -100);
            expect(tx2).to.changeTokenBalance(tokenOut, POS.address, 5);
            expect(newUserLiquidity.balance).to.equal(95);
        });

        it("Should pay fail when deny exceed limit and over limitation", async () => {
            // user deposit token to Vault, userLiquidity will be updated
            // console.log(await tokenIn.balanceOf(user.address));
            await tokenIn.connect(user).approve(VaultContract.address, 100);
            const tx1 = await VaultContract.connect(user).deposit(
                tokenIn.address,
                100,
            );
            //set payment limit for token
            await VaultContract.setLimit(tokenIn.address, 10)
            const userLiq = await VaultContract.userLiquidity(tokenIn.address, user.address);
            expect(userLiq.limit).to.equal(10);
            // console.log(
            //     await VaultContract.userLiquidity(
            //         tokenIn.address,
            //         user.address,
            //     ),
            // );

            //create signature and request payment
            let timestamp = (await ethers.provider.getBlock("latest"))
                .timestamp;
            const signature: string = await signaturePayment(
                1,
                POS.address,
                user.address,
                tokenIn.address,
                false,
                20,
                timestamp + 10000,
            );

            const paymentData = VaultContract.interface.encodeFunctionData(
                "pay",
                [
                    1,
                    POS.address,
                    user.address,
                    tokenIn.address,
                    false,
                    20,
                    timestamp + 10000,
                    signature,
                    defaultBytes,
                ],
            );

            const tx2 = POS.requestPayment(
                1,
                paymentData,
                VaultContract.address,
                tokenOut.address,
            );

            const newUserLiquidity = await VaultContract.userLiquidity(
                tokenIn.address,
                user.address,
            );
            expect(tx1).to.changeTokenBalance(tokenIn, user, -100);
            expect(tx2).to.be.revertedWith("POS: failed to request approve from vault contract");
        });
    });
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
        "02b96378a2f75256c5ebd98ba1e17c69aae427174548c56ae263f76a2160d915",
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
    user: SignerWithAddress
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
