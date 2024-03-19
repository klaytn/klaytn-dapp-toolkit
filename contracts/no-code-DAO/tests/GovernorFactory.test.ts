import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

import { GovernorFactory, TimelockController } from "../typechain-types";
import { StandardGovernor, ERC20VotesStandard } from "../typechain-types";
describe("Greater", () => {
    let user: SignerWithAddress;
    let governorFactory: GovernorFactory;
    let timelock: TimelockController;
    let standardGovernor: StandardGovernor;
    let voteToken: ERC20VotesStandard;

    beforeEach(async () => {
        const accounts: SignerWithAddress[] = await ethers.getSigners();
        user = accounts[0];

        const GovernorFactory = await ethers.getContractFactory(
            "GovernorFactory",
        );
        governorFactory = await GovernorFactory.deploy();

        const TimelockControllerFactory = await ethers.getContractFactory(
            "TimelockController",
        );
        timelock = await TimelockControllerFactory.deploy();

        const StandardGovernorFactory = await ethers.getContractFactory(
            "StandardGovernor",
        );
        standardGovernor = await StandardGovernorFactory.deploy();

        const ERC20VotesStandardFactory = await ethers.getContractFactory(
            "ERC20VotesStandard",
        );
        voteToken = await ERC20VotesStandardFactory.deploy();

        await governorFactory.initialize(timelock.address);
    });

    describe("Deployment", () => {
        it("Should deploy successfully", async () => {
            expect(await governorFactory.owner()).to.equal(user.address);

            expect(await governorFactory.timelockController()).to.equal(
                timelock.address,
            );
        });
    });

    describe("Set governor preset address", () => {
        it("Should set failed", async () => {
            await expect(
                governorFactory.addGovernorPreset(
                    "This is a very long preset name that exceed 32 bytes",
                    standardGovernor.address,
                ),
            ).to.revertedWith("GovernorFactory: invalid name");
        });

        it("Should set governor preset successfully", async () => {
            await governorFactory.addGovernorPreset(
                "SimpleGovernor",
                standardGovernor.address,
            );

            const allPreset = await governorFactory.getAllGovernorPresets();
            expect(allPreset.length).to.equal(1);
            expect(allPreset[0]).to.equal("SimpleGovernor");

            expect(
                await governorFactory.getGovernorPresetAddress(
                    "SimpleGovernor",
                ),
            ).to.equal(standardGovernor.address);
        });

        it("Should set vote token preset successfully", async () => {
            await governorFactory.addVoteTokenPreset(
                "SimpleVoteToken",
                voteToken.address,
            );

            const allPreset = await governorFactory.getAllVoteTokenPresets();
            expect(allPreset.length).to.equal(1);
            expect(allPreset[0]).to.equal("SimpleVoteToken");
            expect(
                await governorFactory.getVoteTokenPresetAddress(
                    "SimpleVoteToken",
                ),
            ).to.equal(voteToken.address);
        });
    });

    describe("Create governor", () => {
        beforeEach(async () => {
            await governorFactory.addGovernorPreset(
                "SimpleGovernor",
                standardGovernor.address,
            );
            console.log("Governor", governorFactory.address);

            await governorFactory.addVoteTokenPreset(
                "SimpleVoteToken",
                voteToken.address,
            );
        });

        it("Should create governor successfully", async () => {
            const salt = ethers.utils.formatBytes32String("This is a salt");
            const voteTokenDeterministic =
                await governorFactory.predictVoteTokenDeterministicAddress(
                    "SimpleVoteToken",
                    salt,
                );
            const timelockDeterministic =
                await governorFactory.predictTimelockDeterministicAddress(salt);

            const governorInitializeData =
                standardGovernor.interface.encodeFunctionData("initialize", [
                    voteTokenDeterministic,
                    timelockDeterministic,
                    10,
                    10,
                    10,
                    10,
                    "MyGovernor",
                ]);

            const voteTokenInitializeData =
                voteToken.interface.encodeFunctionData("initialize", [
                    "SimpleVoteToken",
                    "SVT",
                ]);

            await governorFactory.createGovernor(
                "SimpleGovernor",
                governorInitializeData,
                "SimpleVoteToken",
                voteTokenInitializeData,
                {
                    timelockMinDelay: 1000,
                    timelockExecutors: [],
                    timelockAdmin: user.address,
                    timelockProposers: [],
                },
                salt,
            );

            const governor = governorFactory.governors(0);

            const TimelockControllerFactory = await ethers.getContractFactory(
                "TimelockController",
            );
            const timelockClone = TimelockControllerFactory.attach(
                (await governor).timelock,
            );
            expect(await timelockClone.getMinDelay()).to.equal(1000);

            const StandardGovernorFactory = await ethers.getContractFactory(
                "StandardGovernor",
            );
            const governorClone = StandardGovernorFactory.attach(
                (await governor).governor,
            );
            expect(await governorClone.name()).to.equal("MyGovernor");

            const ERC20VotesStandardFactory = await ethers.getContractFactory(
                "ERC20VotesStandard",
            );
            const voteTokenClone = ERC20VotesStandardFactory.attach(
                (await governor).voteToken,
            );
            expect(await voteTokenClone.name()).to.equal("SimpleVoteToken");
        });
    });
});
