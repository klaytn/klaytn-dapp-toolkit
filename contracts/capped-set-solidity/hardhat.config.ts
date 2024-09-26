import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";
import "@nomiclabs/hardhat-solhint";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-docgen";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "hardhat-tracer";
import "hardhat-log-remover";

dotenv.config();

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: { count: 100 },
        },
        sepolia: {
            url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
        mainnet: {
            url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
        mumbai: {
            url: `https://matic-mumbai.chainstacklabs.com/`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
        bsctestnet: {
            url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
    },
    etherscan: {
        apiKey: {
            goerli: `${process.env.ETHERSCAN_KEY}`,
            sepolia: `${process.env.ETHERSCAN_KEY}`,
            bscTestnet: `${process.env.BSCSCAN_KEY}`,
            polygonMumbai: `${process.env.POLYGONSCAN_KEY}`,
            mainnet: `${process.env.ETHERSCAN_KEY}`,
            bsctestnet: `${process.env.BSCSCAN_KEY}`,
            polygonMainnet: `${process.env.POLYGONSCAN_KEY}`,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.19",
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                        details: {
                            yul: true,
                        },
                    },
                    viaIR: false,
                },
            },
        ],
    },
    paths: {
        sources: "./contracts",
        tests: "./tests",
        cache: "./cache",
        artifacts: "./artifacts",
    },
    mocha: {
        timeout: 200000,
        reporter: "mocha-multi-reporters",
        reporterOptions: {
            configFile: "./mocha-report.json",
        },
    },
    docgen: {
        path: "./docs",
        clear: true,
        runOnCompile: false,
    },
    contractSizer: {
        alphaSort: true,
        runOnCompile: true,
        disambiguatePaths: false,
    },
    gasReporter: {
        currency: "ETH",
        gasPrice: 10,
        enabled: process.env.REPORT_GAS ? true : false,
        excludeContracts: [],
        src: "./contracts",
        outputFile: "./gas-report.txt",
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v6",
    },
};

module.exports = config;
