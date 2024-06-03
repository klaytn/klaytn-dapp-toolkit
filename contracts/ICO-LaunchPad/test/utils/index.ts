import { BigNumber, Contract, Wallet, constants, utils } from "ethers";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export async function testBuyToken(
  router: Contract,
  token: Contract,
  wallet: SignerWithAddress,
  amountETH: number
) {
  const tx = await router
    .connect(wallet)
    .swapExactETHForTokensSupportingFeeOnTransferTokens(
      0,
      [WETH_ADDRESS, token.address],
      wallet.address,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {
        value: utils.parseUnits(amountETH.toString()),
        gasLimit: 1_000_000,
      }
    );
  const reciept = await tx.wait();
  console.log(`Bought with ${amountETH} ETH on address ${wallet.address}`);
  return reciept;
}
export async function testSellToken(
  router: Contract,
  tokenContract: Contract,
  wallet: SignerWithAddress | Wallet,
  tokenAmount: BigNumber | string
) {
  const allowance = await tokenContract.allowance(
    wallet.address,
    router.address
  );
  const maxAllowance = constants.MaxUint256;
  if (allowance.lt(tokenAmount)) {
    const approveTx = await tokenContract
      .connect(wallet)
      .approve(router.address, maxAllowance, { gasLimit: 1_000_000 });
    await approveTx.wait();
    expect(
      await tokenContract.allowance(wallet.address, router.address)
    ).to.equal(maxAllowance);
  }

  const tx = await router
    .connect(wallet)
    .swapExactTokensForETHSupportingFeeOnTransferTokens(
      tokenAmount,
      0,
      [tokenContract.address, WETH_ADDRESS],
      wallet.address,
      Math.floor(Date.now() / 1000) + 60 * 10,
      {
        gasLimit: 5_000_000,
      }
    );

  const receipt = await tx.wait();
  console.log(`Sold ${tokenAmount} tokens`);

  return receipt;
}

export async function getReservePair(dexPair: Contract) {
  const { reserve0, reserve1 } = await dexPair.getReserves();
  return Number(reserve1) / Number(reserve0);
}
export async function geb(wallet: SignerWithAddress) {
  const balance = await wallet.getBalance();
  return (balance as any) / 10 ** 18;
}

export async function gteb(walletAddress: string, tokenContract: Contract) {
  const balance = await tokenContract.balanceOf(walletAddress);
  return (balance as any) / 10 ** (await tokenContract.decimals());
}
