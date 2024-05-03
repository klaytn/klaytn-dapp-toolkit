require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");

/** @type import('hardhat/config').HardhatUserConfig */
const { KLAYTN_RPC, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env || ""

module.exports = {
    solidity: "0.8.19",
    defaultNetwork: "hardhat",
    networks: {
        klaytn: {
            url: KLAYTN_RPC || "",
            accounts: [PRIVATE_KEY],
            chainId: 1001
        }
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY || ""
    },
    sourcify: {
        enabled: true
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true
    }
};
