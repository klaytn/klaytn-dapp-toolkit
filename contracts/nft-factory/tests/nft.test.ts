import * as hre from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";

import { NFT__factory, NFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { URI } from "./utils";

describe("Greater", () => {
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let nft: NFT;
    let NFT: NFT__factory;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];

        NFT = await ethers.getContractFactory("NFT");
        nft = await NFT.deploy();

        await nft.initialize("NFT", "NFT", URI[0], owner.address);

        hre.tracer.nameTags[await nft.getAddress()] = "NFT";
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await nft.owner()).to.equal(owner.address);
            expect(await nft.isMinter(owner.address)).to.equal(true);

            expect(await nft.name()).to.equal("NFT");
            expect(await nft.symbol()).to.equal("NFT");

            expect(await nft.totalSupply()).to.equal(1);
            expect(await nft.balanceOf(owner.address)).to.equal(1);
            expect(await nft.tokenURI(0)).to.equal(URI[0]);
        });
    });

    describe("Set minter", () => {
        it("Should set minter failed - Only owner", async () => {
            await expect(
                nft.connect(user1).addMinter(user1.address),
            ).to.revertedWith("Ownable: caller is not the owner");

            await expect(
                nft.connect(user1).removeMinter(owner.address),
            ).to.revertedWith("Ownable: caller is not the owner");
        });

        it("Should set minter failed - Status set", async () => {
            await expect(
                nft.addMinter(owner.address),
            ).to.revertedWithCustomError(nft, "StatusSet");

            await expect(
                nft.removeMinter(user1.address),
            ).to.revertedWithCustomError(nft, "StatusSet");
        });

        it("Should set minter successfully", async () => {
            await nft.addMinter(user1.address);
            expect(await nft.isMinter(user1.address)).to.equal(true);

            await nft.removeMinter(user1.address);
            expect(await nft.isMinter(user1.address)).to.equal(false);
        });
    });

    describe("Mint NFT", () => {
        it("Should mint fail - not minter", async () => {
            await expect(
                nft.connect(user1).mint(user1.address, URI[1]),
            ).to.revertedWithCustomError(nft, "OnlyMinter");

            await nft.removeMinter(owner.address);
            await expect(
                nft.mint(user1.address, URI[1]),
            ).to.revertedWithCustomError(nft, "OnlyMinter");
        });

        it("Should mint successfully", async () => {
            await nft.mint(user1.address, URI[1]);
            expect(await nft.totalSupply()).to.equal(2);
            expect(await nft.balanceOf(user1.address)).to.equal(1);
            expect(await nft.tokenURI(1)).to.equal(URI[1]);

            await nft.addMinter(user1.address);
            await nft.mint(user1.address, URI[1]);
            expect(await nft.totalSupply()).to.equal(3);
            expect(await nft.balanceOf(user1.address)).to.equal(2);
            expect(await nft.tokenURI(2)).to.equal(URI[1]);
        });
    });
});
