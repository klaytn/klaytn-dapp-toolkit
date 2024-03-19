import { ethers } from "hardhat";
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from "chai";
import { Signer, parseUnits, getBytes, formatUnits, keccak256 } from "ethers";
import { AbiCoder } from "ethers";
import { parseEther } from 'ethers/lib/utils';
import { CrPayment } from "../typechain";
import { ERC20Token, ERC20Token__factory } from "../typechain-types";

describe("CrPayment Contract", function () {
    const VERIFIER_ADDRESS = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
    let owner: SignerWithAddress;
    let feeTo: SignerWithAddress;
    let merchant: SignerWithAddress;
    let customer: SignerWithAddress;
    let token: SignerWithAddress;
    let crPayment: SignerWithAddress;
    let mockToken: ERC20Token;
    beforeEach(async function () {
        [owner, merchant, customer, token, feeTo] = await ethers.getSigners();
        const CrPaymentFactory = await ethers.getContractFactory("CrPayment");
        crPayment = await CrPaymentFactory.connect(owner).deploy(
            feeTo.address, // feeTo address
            1000, // platformFeeBasisPoints
            owner.address // verifier address
        );

        const MockTokenFactory: ERC20Token__factory = <ERC20Token__factory>(
            await ethers.getContractFactory('ERC20Token')
        );
        mockToken = <ERC20Token>await MockTokenFactory.deploy();
        const value = 10000n;
        const amount = parseUnits(value.toString(), 0);
        await mockToken.connect(owner).mint(customer.address, amount);
    });

    it("should set feeTo address correctly", async function () {
        const newFeeTo = await merchant.getAddress();
        await crPayment.connect(owner).setFeeTo(newFeeTo);
        expect(await crPayment.feeTo()).to.equal(newFeeTo);
    });

    it("should set platformFeeBasisPoints correctly", async function () {
        const newFeeBasisPoints = 2000;
        await crPayment.connect(owner).setPlatformFeeBasisPoints(newFeeBasisPoints);
        expect(await crPayment.platformFeeBasisPoints()).to.equal(newFeeBasisPoints);
    });

    it("should set verifier address correctly", async function () {
        const newVerifier = await token.getAddress();
        await crPayment.connect(owner).setVerifier(newVerifier);
        expect(await crPayment.verifier()).to.equal(newVerifier);
    });

    it("should perform a valid payment", async function () {
        const sessionId = 1;
        const tokenAddress = await mockToken.getAddress();
        const value = 1000n;
        const amount = parseUnits(value.toString(), 0); // Assuming 0 decimal places
        const deadline = Math.floor(Date.now() / 1000) + 3600; // Expire in 1 hour
        let signature = await signaturePayment(
            sessionId,
            merchant.address,
            customer.address,
            tokenAddress,
            amount,
            deadline
        );
        await mockToken.connect(customer).approve(crPayment.getAddress(), amount);
        const tx = crPayment.connect(customer).pay(
            sessionId,
            merchant.address,
            tokenAddress,
            amount,
            deadline,
            signature
        );
        const platformFeeBasisPoints = await crPayment.platformFeeBasisPoints();
        await expect(
            tx
        )
            .to.emit(crPayment, "Payment")
            .withArgs(sessionId, await merchant.getAddress(), tokenAddress, amount);
        await expect(tx).to.changeTokenBalances(
            mockToken,
            [customer.address, merchant.address],
            [amount * -1n, amount * (10000n - platformFeeBasisPoints)/ 10000n]
        )
    });

    // Add more test cases as needed

});

async function signaturePayment(
    sessionId: number,
    merchant: string,
    sender: string,
    token: string,
    amount: BigInt,
    deadline: number,
) {
    const { chainId } = await ethers.provider.getNetwork();
    // 66 byte string, which represents 32 bytes of data
    let messageHash = encodePayment(
        chainId,
        sessionId,
        merchant,
        sender,
        token,
        amount,
        deadline,
    );
    // 32 bytes of data in Uint8Array
    let messageHashBinary = getBytes(messageHash);

    let wallet = new ethers.Wallet(
        "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    );

    // To sign the 32 bytes of data, make sure you pass in the data
    let signature = await wallet.signMessage(messageHashBinary);
    return signature;
}

function encodePayment(
    chainId: BigInt,
    sessionId: number,
    merchant: string,
    sender: string,
    token: string,
    amount: BigInt,
    deadline: number,
) {
    const defaultAbiCoder = new AbiCoder();
    const payload = defaultAbiCoder.encode(
        [
            'uint256',
            'uint256',
            'address',
            'address',
            'address',
            'uint256',
            'uint256',
        ],
        [
            chainId,
            sessionId,
            merchant,
            sender,
            token,
            amount,
            deadline,
        ]
    );
    return keccak256(payload);
}

