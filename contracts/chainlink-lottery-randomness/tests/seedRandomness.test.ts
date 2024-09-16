import * as hre from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { LotterySeedRandomness, MockVRFCoordinator } from "../typechain-types";
import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";
const RANDOMNESS_CONFIG = {
    LINK_TOKEN: "0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
    VRF_COORDINATOR: "0x271682DEB8C4E0901D1a1550aD2e64D568E69909",
    KEY_HASH:
        "0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86805", // 1000 gwei
    SUBSCRIPTION_ID: "1234",
    TICKET_OWNER_DIGEST:
        "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c",
    DRAWING_TIME: 0,
    TOTAL_TICKETS: 19640,
    TOTAL_WINNING_TICKETS: 800,
};
describe("SeedRandomness", () => {
    let owner: SignerWithAddress;
    let user: SignerWithAddress;
    let seedRandomness: LotterySeedRandomness;
    let mockVRFCoordinator: MockVRFCoordinator;
    let drawingTime: number;
    const requestId = "0x1234567890";

    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        owner = accounts[0];
        user = accounts[1];

        const MockVRFCoordinator = await hre.ethers.getContractFactory(
            "MockVRFCoordinator",
        );

        const SeedRandomness = await hre.ethers.getContractFactory(
            "LotterySeedRandomness",
        );
        seedRandomness = await SeedRandomness.deploy();

        mockVRFCoordinator = await MockVRFCoordinator.deploy(
            await seedRandomness.getAddress(),
            requestId,
        );

        const timestamp = await time.latest();
        drawingTime = timestamp + 1000;

        await seedRandomness.initialize(
            RANDOMNESS_CONFIG.TOTAL_TICKETS,
            RANDOMNESS_CONFIG.TOTAL_WINNING_TICKETS,
            drawingTime,
            await mockVRFCoordinator.getAddress(),
            RANDOMNESS_CONFIG.SUBSCRIPTION_ID,
            RANDOMNESS_CONFIG.KEY_HASH,
            RANDOMNESS_CONFIG.TICKET_OWNER_DIGEST,
        );
    });

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            expect(await seedRandomness.owner()).to.be.equal(owner.address);
        });

        it("Should set the right total tickets", async () => {
            expect(await seedRandomness.totalTicket()).to.be.equal(
                RANDOMNESS_CONFIG.TOTAL_TICKETS,
            );
        });

        it("Should set the right total winning tickets", async () => {
            expect(await seedRandomness.totalWinningTicket()).to.be.equal(
                RANDOMNESS_CONFIG.TOTAL_WINNING_TICKETS,
            );
        });

        it("Should set the right drawing time", async () => {
            expect(await seedRandomness.drawingTime()).to.be.equal(drawingTime);
        });

        it("Should set the right vrf coordinator", async function () {
            expect(await seedRandomness.vrfCoordinator()).to.be.equal(
                await mockVRFCoordinator.getAddress(),
            );
        });

        it("Should set the right subscription id", async () => {
            expect(await seedRandomness.subscriptionId()).to.be.equal(
                RANDOMNESS_CONFIG.SUBSCRIPTION_ID,
            );
        });

        it("Should set the right key hash", async () => {
            expect(await seedRandomness.keyHash()).to.be.equal(
                RANDOMNESS_CONFIG.KEY_HASH,
            );
        });

        it("Should set the right winning seed", async () => {
            expect(await seedRandomness.winningSeed()).to.be.equal(0);
        });
    });

    describe("Setter", () => {
        it("Should set the right total tickets", async () => {
            await expect(
                seedRandomness.connect(user).setTotalTicket(1000),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await seedRandomness.setTotalTicket(1000);
            expect(await seedRandomness.totalTicket()).to.be.equal(1000);
        });

        it("Should set the right total winning tickets", async () => {
            await expect(
                seedRandomness.connect(user).setTotalWinningTicket(100),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await seedRandomness.setTotalWinningTicket(100);
            expect(await seedRandomness.totalWinningTicket()).to.be.equal(100);
        });

        it("Should set the right drawing time", async () => {
            const timestamp = await time.latest();

            await expect(
                seedRandomness.connect(user).setDrawingTime(timestamp + 1),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await seedRandomness.setDrawingTime(timestamp + 1);
            expect(await seedRandomness.drawingTime()).to.be.equal(
                timestamp + 1,
            );
        });

        it("Should set the right vrf coordinator", async () => {
            await expect(
                seedRandomness.connect(user).setVrfCoordinator(user.address),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await seedRandomness.setVrfCoordinator(owner);
            expect(await seedRandomness.vrfCoordinator()).to.be.equal(
                owner.address,
            );
        });

        it("Should set the right subscription id", async () => {
            await expect(
                seedRandomness.connect(user).setSubscriptionId("4321"),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            const newSubscriptionId = "4321";
            await seedRandomness.setSubscriptionId(newSubscriptionId);
            expect(await seedRandomness.subscriptionId()).to.be.equal(
                newSubscriptionId,
            );
        });

        it("Should set the right key hash", async () => {
            await expect(
                seedRandomness
                    .connect(user)
                    .setKeyHash(
                        "0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86801",
                    ),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            const newKeyHash =
                "0x9fe0eebf5e446e3c998ec9bb19951541aee00bb90ea201ae456421a2ded86801";
            await seedRandomness.setKeyHash(newKeyHash);
            expect(await seedRandomness.keyHash()).to.be.equal(newKeyHash);
        });
    });

    describe("draw randomness", () => {
        it("Should draw winning seed failed", async () => {
            await expect(
                seedRandomness.connect(user).drawWinningSeed(),
            ).to.be.revertedWith("Ownable: caller is not the owner");

            await expect(
                seedRandomness.drawWinningSeed(),
            ).to.be.revertedWithCustomError(seedRandomness, "NotDrawingTime");
        });

        it("Should draw winning seed success", async () => {
            await time.increaseTo(drawingTime + 1);
            await seedRandomness.drawWinningSeed();

            expect(await seedRandomness.seedRequestId()).to.equal(requestId);
            expect(await seedRandomness.winningSeed()).to.equal(0);
            expect(await seedRandomness.fullfilled()).to.equal(false);

            // Should revert if drawing again
            await expect(
                seedRandomness.drawWinningSeed(),
            ).to.be.revertedWithCustomError(seedRandomness, "AlreadyDrawn");
        });

        it("Should fulfill failed if not drawn", async () => {
            await expect(
                mockVRFCoordinator.fulfillRandomness(1, [1]),
            ).to.revertedWithCustomError(
                seedRandomness,
                "InvalidSeedRequestId",
            );
        });

        it("Should fulfill success", async () => {
            await time.increaseTo(drawingTime + 1);
            await seedRandomness.drawWinningSeed();

            // Should failed if not VrfCoordinator
            await expect(seedRandomness.rawFulfillRandomWords(1, [1]))
                .to.revertedWithCustomError(
                    seedRandomness,
                    "OnlyCoordinatorCanFulfill",
                )
                .withArgs(owner.address, await mockVRFCoordinator.getAddress());

            // Should failed if wrong requestId
            await expect(
                mockVRFCoordinator.fulfillRandomness(1, [1]),
            ).to.revertedWithCustomError(
                seedRandomness,
                "InvalidSeedRequestId",
            );

            // Should failed if wrong random words length
            await expect(
                mockVRFCoordinator.fulfillRandomness(requestId, [1, 2]),
            ).to.revertedWithCustomError(seedRandomness, "InvalidRandomWords");

            // Should fulfill success
            await mockVRFCoordinator.fulfillRandomness(requestId, [123456789]);

            expect(await seedRandomness.winningSeed()).to.equal(123456789);
            expect(await seedRandomness.fullfilled()).to.equal(true);

            // Should failed
            await expect(
                mockVRFCoordinator.fulfillRandomness(requestId, [1]),
            ).to.revertedWithCustomError(seedRandomness, "AlreadyFulfilled");

            // Should return correct winning tickets
            console.log(
                await seedRandomness.getWinningTickets.estimateGas({
                    gasLimit: 100_000_000,
                }),
            );
            const winningTicketsBigInt = await seedRandomness.getWinningTickets(
                { gasLimit: 100_000_000 },
            );
            const winningTickets = winningTicketsBigInt.map((x) =>
                Number(x.toString()),
            );
            expect(winningTickets.length).to.equal(
                RANDOMNESS_CONFIG.TOTAL_WINNING_TICKETS,
            );

            const ticketSet = new Set(winningTickets);
            expect(ticketSet.size).to.equal(winningTickets.length);

            expect(Math.max(...winningTickets)).to.lessThanOrEqual(
                RANDOMNESS_CONFIG.TOTAL_TICKETS,
            );

            expect(Math.min(...winningTickets)).to.greaterThanOrEqual(1);

            console.log(winningTickets);
        });
    });
});
