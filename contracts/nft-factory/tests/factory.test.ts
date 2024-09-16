import * as hre from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";

import {
    NFTFactory__factory,
    NFTFactory,
    NFT__factory,
    NFT,
} from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { URI } from "./utils";

describe("Greater", () => {
    let owner: SignerWithAddress;
    let user1: SignerWithAddress;
    let nftFactory: NFTFactory;
    let nft: NFT;
    let NFTFactory: NFT__factory;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        owner = accounts[0];
        user1 = accounts[1];

        NFTFactory = await ethers.getContractFactory("NFT");
        nft = await NFTFactory.deploy();

        const NFTFactoryFactory = await ethers.getContractFactory("NFTFactory");
        nftFactory = await NFTFactoryFactory.deploy();

        await nftFactory.initialize(await nft.getAddress());

        hre.tracer.nameTags[await nftFactory.getAddress()] = "NFTFactory";
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await nftFactory.owner()).to.equal(owner.address);
            expect(await nftFactory.implementation()).to.equal(
                await nft.getAddress(),
            );
        });
    });

    describe("Set implementation", () => {
        it("Should set implementation failed - Only owner", async () => {
            await expect(
                nftFactory.connect(user1).setImplementation(user1.address),
            ).to.revertedWith("Ownable: caller is not the owner");
        });

        it("Should set implementation failed - Not ERC721", async () => {
            await expect(
                nftFactory.setImplementation(user1.address),
            ).to.revertedWithCustomError(nftFactory, "ImplementationNotERC721");
        });

        it("Should set implementation successfully", async () => {
            let nft_2 = await NFTFactory.deploy();
            await nftFactory.setImplementation(await nft_2.getAddress());

            expect(await nftFactory.implementation()).to.equal(
                await nft_2.getAddress(),
            );
        });
    });

    describe("Create NFT", () => {
        it("Should create NFT successful", async () => {
            await expect(
                nftFactory.createNFT("NFT Name", "NFT", URI[0]),
            ).to.emit(nftFactory, "NFTCreated");

            expect(await nftFactory.getNFTCount(owner.address)).to.equal(1);
            let nft_2 = <NFT>(
                NFTFactory.attach(await nftFactory.getNFT(owner.address, 0))
            );

            expect(await nft_2.owner()).to.equal(owner.address);
            expect(await nft_2.isMinter(owner.address)).to.equal(true);
            expect(await nft_2.name()).to.equal("NFT Name");
            expect(await nft_2.symbol()).to.equal("NFT");
            expect(await nft_2.totalSupply()).to.equal(1);
            expect(await nft_2.balanceOf(owner.address)).to.equal(1);
            expect(await nft_2.tokenURI(0)).to.equal(URI[0]);

            await expect(
                nftFactory
                    .connect(user1)
                    .createNFT("NFT 2 Name", "NFT2", URI[1]),
            ).to.emit(nftFactory, "NFTCreated");

            expect(await nftFactory.getNFTCount(user1.address)).to.equal(1);
            let nft_3 = <NFT>(
                NFTFactory.attach(await nftFactory.getNFT(user1.address, 0))
            );
            expect(await nft_3.owner()).to.equal(user1.address);
            expect(await nft_3.isMinter(user1.address)).to.equal(true);
            expect(await nft_3.name()).to.equal("NFT 2 Name");
            expect(await nft_3.symbol()).to.equal("NFT2");
            expect(await nft_3.totalSupply()).to.equal(1);
            expect(await nft_3.balanceOf(user1.address)).to.equal(1);
            expect(await nft_3.tokenURI(0)).to.equal(URI[1]);

            await nftFactory.createNFT("NFT 3 Name", "NFT3", URI[1]);
            expect(await nftFactory.getNFTCount(owner.address)).to.equal(2);
            let nft_4 = <NFT>(
                NFTFactory.attach(await nftFactory.getNFT(owner.address, 1))
            );
            expect(await nft_4.owner()).to.equal(owner.address);
            expect(await nft_4.isMinter(owner.address)).to.equal(true);
            expect(await nft_4.name()).to.equal("NFT 3 Name");
            expect(await nft_4.symbol()).to.equal("NFT3");
            expect(await nft_4.totalSupply()).to.equal(1);
            expect(await nft_4.balanceOf(owner.address)).to.equal(1);
            expect(await nft_4.tokenURI(0)).to.equal(URI[1]);

            await expect(
                nftFactory.getNFT(user1.address, 1),
            ).to.revertedWithCustomError(nftFactory, "IndexOutOfBounds");
        });
    });
});
