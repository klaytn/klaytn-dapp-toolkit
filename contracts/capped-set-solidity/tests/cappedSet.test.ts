import * as hre from "hardhat";
import { expect } from "chai";
import { ethers } from "hardhat";

import { CappedSet__factory, CappedSet } from "../typechain-types";

describe("CappedSet", () => {
    let cappedSet: CappedSet;
    let addresses: string[];

    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        addresses = accounts.slice(10).map((account) => account.address);

        const CappedSet: CappedSet__factory = <CappedSet__factory>(
            await ethers.getContractFactory("CappedSet")
        );
        cappedSet = await CappedSet.deploy(5);

        hre.tracer.nameTags[await cappedSet.getAddress()] = "CappedSet";
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await cappedSet.cap()).to.equal(5n);
            expect(await cappedSet.size()).to.equal(0n);
        });
    });

    describe("Set greeting", () => {
        it("Should fail - Insert invalid address", async () => {
            await expect(
                cappedSet.insert(ethers.ZeroAddress, 2),
            ).to.revertedWithCustomError(cappedSet, "EInvalidAddress");
        });

        it("Should Insert items successfull and return lowest item", async () => {
            // Should return (0, 0) for the first items
            let { newLowestAddress, newLowestValue } =
                await cappedSet.insert.staticCall(addresses[0], 2);
            expect(newLowestAddress).to.equal(ethers.ZeroAddress);
            expect(newLowestValue).to.equal(0n);

            await cappedSet.insert(addresses[0], 2);
            expect(await cappedSet.size()).to.equal(1n);
            expect(await cappedSet.getValue(addresses[0])).to.equal(2n);
            await expect(
                cappedSet.getValue(addresses[1]),
            ).to.revertedWithCustomError(cappedSet, "EAddressNotExist");

            // Should return lowest item
            ({ newLowestAddress, newLowestValue } =
                await cappedSet.insert.staticCall(addresses[1], 4));
            expect(newLowestAddress).to.equal(addresses[0]);
            expect(newLowestValue).to.equal(2n);

            await cappedSet.insert(addresses[1], 4);
            await cappedSet.insert(addresses[2], 1);
            await cappedSet.insert(addresses[3], 3);

            ({ newLowestAddress, newLowestValue } =
                await cappedSet.insert.staticCall(addresses[4], 5));

            expect(newLowestAddress).to.equal(addresses[2]);
            expect(newLowestValue).to.equal(1n);
            await cappedSet.insert(addresses[4], 5);

            expect(await cappedSet.size()).to.equal(5n);
            expect(await cappedSet.getValue(addresses[1])).to.equal(4n);
            expect(await cappedSet.getValue(addresses[2])).to.equal(1n);
            expect(await cappedSet.getValue(addresses[3])).to.equal(3n);
            expect(await cappedSet.getValue(addresses[4])).to.equal(5n);
        });
    });

    describe("Modify items", () => {
        beforeEach(async () => {
            await cappedSet.insert(addresses[0], 2);
            await cappedSet.insert(addresses[1], 4);
            await cappedSet.insert(addresses[2], 1);
            await cappedSet.insert(addresses[3], 3);
            await cappedSet.insert(addresses[4], 5);
        });

        it("Should fail - Insert existing item", async () => {
            await expect(
                cappedSet.insert(addresses[1], 6),
            ).to.revertedWithCustomError(cappedSet, "EAddressExist");
        });

        it("Should Insert items exceeding cap and boot out lowest item", async () => {
            const { newLowestAddress, newLowestValue } =
                await cappedSet.insert.staticCall(addresses[5], 6);
            expect(newLowestAddress).to.equal(addresses[0]);
            expect(newLowestValue).to.equal(2n);

            // Should boot out lowest item (address[2])
            await cappedSet.insert(addresses[5], 6);
            expect(await cappedSet.size()).to.equal(5n);
            expect(await cappedSet.getValue(addresses[5])).to.equal(6n);
            await expect(
                cappedSet.getValue(addresses[2]),
            ).to.revertedWithCustomError(cappedSet, "EAddressNotExist");
        });

        it("Should fail - Update non-existing item", async () => {
            await expect(
                cappedSet.update(addresses[5], 7),
            ).to.revertedWithCustomError(cappedSet, "EAddressNotExist");
        });

        it("Should Update items successful and return new lowest item", async () => {
            // Should return lowest item
            let { newLowestAddress, newLowestValue } =
                await cappedSet.update.staticCall(addresses[2], 6);
            expect(newLowestAddress).to.equal(addresses[0]);
            expect(newLowestValue).to.equal(2n);

            await cappedSet.update(addresses[2], 6);
            expect(await cappedSet.size()).to.equal(5n);
            expect(await cappedSet.getValue(addresses[2])).to.equal(6n);

            ({ newLowestAddress, newLowestValue } =
                await cappedSet.update.staticCall(addresses[4], 10));
            expect(newLowestAddress).to.equal(addresses[0]);
            expect(newLowestValue).to.equal(2n);

            // Insert new value will boot out addresses[0]
            await cappedSet.insert(addresses[5], 7);
            expect(await cappedSet.size()).to.equal(5n);
            expect(await cappedSet.getValue(addresses[5])).to.equal(7n);
            await expect(
                cappedSet.getValue(addresses[0]),
            ).to.revertedWithCustomError(cappedSet, "EAddressNotExist");
        });

        it("Should fail - Remove non-existing item", async () => {
            await expect(
                cappedSet.remove(addresses[5]),
            ).to.revertedWithCustomError(cappedSet, "EAddressNotExist");
        });

        it("Should Remove items successful and return new lowest item", async () => {
            // Should return lowest item
            let { newLowestAddress, newLowestValue } =
                await cappedSet.remove.staticCall(addresses[2]);
            expect(newLowestAddress).to.equal(addresses[0]);
            expect(newLowestValue).to.equal(2n);

            await cappedSet.remove(addresses[2]);
            expect(await cappedSet.size()).to.equal(4n);
            await expect(
                cappedSet.getValue(addresses[2]),
            ).to.revertedWithCustomError(cappedSet, "EAddressNotExist");

            ({ newLowestAddress, newLowestValue } =
                await cappedSet.remove.staticCall(addresses[4]));
            expect(newLowestAddress).to.equal(addresses[0]);
            expect(newLowestValue).to.equal(2n);

            await cappedSet.remove(addresses[0]);
            await cappedSet.remove(addresses[1]);
            await cappedSet.remove(addresses[3]);
            await cappedSet.remove(addresses[4]);

            expect(await cappedSet.size()).to.equal(0n);
        });
    });

    describe("Deploy invalid cap", () => {
        it("Should fail - Invalid cap", async () => {
            const CappedSet: CappedSet__factory = <CappedSet__factory>(
                await ethers.getContractFactory("CappedSet")
            );
            cappedSet = await CappedSet.deploy(5);
            await expect(CappedSet.deploy(0)).to.revertedWithCustomError(
                cappedSet,
                "EInvalidCap",
            );
        });
    });
});
