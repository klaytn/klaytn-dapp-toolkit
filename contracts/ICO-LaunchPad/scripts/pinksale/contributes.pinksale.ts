import ca from "../cache/contract.json";
import { BigNumber, Contract, Wallet } from "ethers";
import { Token, Token__factory } from "../../typechain-types";
import routerArtifact from "@uniswap/v2-periphery/build/UniswapV2Router02.json";

import wallets from "../cache/wallets.json";
import { testSellToken } from "../../test/utils";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import PINKSALE_ABI from "./pinksale.json";
// only BSC
const PRESALE_ADDRESS = "0x8f5a9990902c4384a73a208fb5ebb65c7fc43c97";
const NUM_WALLETS = 2;
const MIN_CONTRIBUTED_BNB = 0.001;
const MAX_CONTRIBUTED_BNB = 0.002;
const PRIVATE_KEY_MAIN_WALLET =
  "0x286dfb0ed615ed04483c881ebeb9e9265b1400f1ca402f2da0386c8b54eaeca7";
async function main() {
  let mainWallet: Wallet | SignerWithAddress;
  if (PRIVATE_KEY_MAIN_WALLET.length > 0)
    mainWallet = new Wallet(PRIVATE_KEY_MAIN_WALLET, ethers.provider);
  else mainWallet = (await ethers.getSigners())[0];
  const mainWalletBalance = await mainWallet.getBalance();
  const contributedWallets: Wallet[] = [];
  for (let i = 0; i < 10; i++) {
    const wallet = await ethers.Wallet.createRandom();
    contributedWallets.push(new Wallet(wallet.privateKey, ethers.provider));
  }
  // presale
  const presaleContract = new Contract(
    PRESALE_ADDRESS,
    PINKSALE_ABI,
    ethers.provider
  );
  const presalePoolState = JSON.parse(
    (await presaleContract.poolStates()).poolDetails
  );
  console.log("Wallet balance:", ethers.utils.formatEther(mainWalletBalance));
  console.log("Contributed wallets:", contributedWallets[0].privateKey);
  console.log(
    `website: ${presalePoolState?.b} \ntwitter: ${presalePoolState?.d} \ntelegram: ${presalePoolState?.f} \n`
  );

  // console.log(ethers.utils.parseEther('0.00001'))
  // console.log(
  //   await presaleContract.connect(contributedWallets[0]).contribute(0, "0x0000000000000000000000000000000000000000", {
  //     value: ethers.utils.parseEther('0.00001')
  //   })
  // )
  // presaleContract.functions.contribute(0, '0x0000000000000000000000000000000000000000')
  //   .send({ value: ethers.utils.formatEther(1) })
  //   .then((res:any) => {
  //       console.log('Transaction receipt:', res);
  //   })
  //   .catch((error:any) => {
  //       console.error('Error in transaction:', error);
  //   });
  // // console.log(await presaleContract.Contribute({
  // //   value: BigNumber.from('100')
  // // }))
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
