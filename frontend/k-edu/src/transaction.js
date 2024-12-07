export default function Transactions(klayWalletPrivKey, klayWalletAddress) {
  const { ethers } = require("ethers");

  const url = "https://public-en-baobab.klaytn.net";
  // const teskKlayUrl = "https://baobab.wallet.klaytn.foundation/faucet";
  const provider = new ethers.providers.JsonRpcProvider(url);

  // const klayWalletPrivKey = process.env.REACT_APP_KLAY_KEY;
  // const klayWalletAddress = process.env.REACT_APP_KLAY_ADDRESS;
  const signer = new ethers.Wallet(klayWalletPrivKey, provider);

  if (!klayWalletPrivKey) {
    console.error("Private key is not defined in environment variables");
  }

  const getBalance = async () => {
    const balance = await signer.getBalance();
    console.log(`Balance: ${ethers.utils.formatEther(balance)} KLAY`);
    return balance;
  };

  const sendTx = async () => {
    const tx = await signer.sendTransaction({
      to: klayWalletAddress,
      value: 5,
      maxFeePerGas: 250000000000,
      maxPriorityFeePerGas: 250000000000,
      gasLimit: 21000,
    });

    const receipt = await tx.wait();
    console.log(receipt);
  };

  return {
    handleBalance: getBalance,
    handleGetKlay: sendTx,
  };
}
