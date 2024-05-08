import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
  import { expect } from "chai";
  import hre from "hardhat";
  import { getAddress, parseUnits } from "viem";
  
  describe("Trust MLM", function () {
    async function deployTrustMLM() {
      const [deployer, defaultUpline, account1, account2] = await hre.viem.getWalletClients();

      const usdc = await hre.viem.deployContract("ExampleUSDC", []);
      const trustMLM = await hre.viem.deployContract("TrustMLM", [usdc.address, defaultUpline.account.address]);
  
      const publicClient = await hre.viem.getPublicClient();
  
      return {
        deployer,
        defaultUpline,
        account1,
        account2,
        usdc,
        trustMLM,
        publicClient,
      };
    }
  
    describe("Deployment", function () {
      it("Name & Symbol", async function () {
        const { trustMLM } = await loadFixture(deployTrustMLM);

        expect(await trustMLM.read.name()).to.equal("Trust MLM");
        expect(await trustMLM.read.symbol()).to.equal("TMLM");
      });

      it("Default Upline & Initial Supply", async function () {
        const { trustMLM, defaultUpline } = await loadFixture(deployTrustMLM);
  
        // tokenId 1-10 is defaultUpline Account
        const tokenId = await trustMLM.read.lastUplineTokenId();
        expect((await trustMLM.read.ownerOf([tokenId])).toLowerCase()).to.equal(defaultUpline.account.address);
        expect(await trustMLM.read.totalSupply()).to.equal(BigInt(10));
      });
    });
  
    describe("Registration", function () {
      it("Registration with Account 1 & Account 2", async function () {
        const { usdc, trustMLM, defaultUpline, account1, account2 } = await loadFixture(deployTrustMLM);

        // Check Balance USDC is 0
        expect(await usdc.read.balanceOf([defaultUpline.account.address])).to.equal(BigInt(0));
        expect(await usdc.read.balanceOf([account1.account.address])).to.equal(BigInt(0));
        expect(await usdc.read.balanceOf([account2.account.address])).to.equal(BigInt(0));

        // Send 100 USDC to Account 1 & Account 2
        const decimalUSDC = Number(await usdc.read.decimals());
        const amount = parseUnits("100", decimalUSDC);
        await usdc.write.transfer([account1.account.address, amount]);
        await usdc.write.transfer([account2.account.address, amount]);
        expect(await usdc.read.balanceOf([account1.account.address])).to.equal(amount);
        expect(await usdc.read.balanceOf([account2.account.address])).to.equal(amount);

        // Registration Account 1 with Default Upline
        await usdc.write.approve([trustMLM.address, amount], {
            account: account1.account
        });
        expect(await usdc.read.allowance([account1.account.address, trustMLM.address])).to.equal(amount);
        await trustMLM.write.registration([
            BigInt(0), // Set 0 if use default upline
            BigInt(11) // new tokenId
        ], {
            account: account1.account
        });
        expect(await usdc.read.balanceOf([defaultUpline.account.address])).to.equal(amount); // tokenId 1-10 distribute to defaultUpline Account -> total 100 USDC

        // Registration Account 2 with Account 1 (tokenId 11)
        await usdc.write.approve([trustMLM.address, amount], {
            account: account2.account
        });
        expect(await usdc.read.allowance([account2.account.address, trustMLM.address])).to.equal(amount);
        expect((await trustMLM.read.ownerOf([BigInt(11)])).toLowerCase()).to.equal(account1.account.address);
        await trustMLM.write.registration([
            BigInt(11), // Set 11 if use Upline Account 1
            BigInt(12) // new tokenId
        ], {
            account: account2.account
        });
        expect(await usdc.read.balanceOf([defaultUpline.account.address]))
        .to.equal((amount + parseUnits("90", decimalUSDC))); // amount + (tokenId 2-10 distribute to defaultUpline Account) -> total 110 USDC
        expect(await usdc.read.balanceOf([account1.account.address])).to.equal(parseUnits("10", decimalUSDC)); // total 90 USDC
      });
    });
  });
  