import "@nomicfoundation/hardhat-chai-matchers";
import "@nomiclabs/hardhat-truffle5";
import "@nomiclabs/hardhat-web3";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-etherscan";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/types";
import "hardhat-docgen";
import "hardhat-gas-reporter";

dotenv.config();

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            accounts: { count: 100 },
        },
        rinkeby: {
            url: `https://rinkeby.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
        goerli: {
            url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
            accounts: [`${process.env.PRIVATE_KEY}`],
        },
        // mainnet: {
        //     url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
        //     accounts: [`${process.env.PRIVATE_KEY}`]
        // }

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
            mainnet: `${process.env.ETHERSCAN_KEY}`,
            bscTestnet: `${process.env.BSCSCAN_KEY}`,
            goerli: `${process.env.ETHERSCAN_KEY}`,
            polygonMumbai: `${process.env.POLYGONSCAN_KEY}`,
        },
    },
    solidity: {
        compilers: [
            {
                version: "0.8.18",
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        details: {
                            yulDetails: {
                                optimizerSteps: "u",
                            },
                            yul: true,
                        },
                    },
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
    gasReporter: {
        currency: "ETH",
        gasPrice: 10,
        enabled: process.env.REPORT_GAS ? true : false,
        excludeContracts: [],
        src: "./contracts",
    },
    typechain: {
        outDir: "typechain-types",
        target: "ethers-v5",
    },
};

module.exports = config;
