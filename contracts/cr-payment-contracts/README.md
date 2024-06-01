# Smart contract for CrPayment

## Deployed addresses

### CrPayment.sol

| Network             | Address                                    |
| ------------------- | ------------------------------------------ |
| Sepolia             | 0x1304c43eFeFDEe58639877eED2D76b0DF80e50Fa |
| BNB testnet         | 0x4a7fD9244E4d3AddF16C503ec4709D40a887E499 |
| Polygon Mumbai      | 0x50209FE5c038724CF37B12CF6f51Da68a1fD5221 |
| Arbitrum Goerli     | 0x0000000000000000000000000000000000000000 |
| Optimism Superchain | 0x0000000000000000000000000000000000000000 |
| Avalanche Testnet   | 0x8843010C138A3eBF5080C6c6374BeA29A2de9e4C |

## Usage

### Pre Requisites

Before being able to run any command, you need to create a `.env` file and set a BIP-39 compatible mnemonic as an
environment variable. You can follow the example in `.env.example`. If you don't already have a mnemonic, you can use
this [website](https://iancoleman.io/bip39/) to generate one.

Then, proceed with installing dependencies:

```sh
$ yarn install
```

### Compile

Compile the smart contracts with Hardhat:

```sh
$ yarn compile
```

### TypeChain

Compile the smart contracts and generate TypeChain bindings:

```sh
$ yarn typechain
```

### Test

Run the tests with Hardhat:

```sh
$ yarn test
```

### Lint Solidity

Lint the Solidity code:

```sh
$ yarn lint:sol
```

### Lint TypeScript

Lint the TypeScript code:

```sh
$ yarn lint:ts
```

### Coverage

Generate the code coverage report:

```sh
$ yarn coverage
```

### Report Gas

See the gas usage per unit test and average gas per method call:

```sh
$ REPORT_GAS=true yarn test
```

### Clean

Delete the smart contract artifacts, the coverage reports and the Hardhat cache:

```sh
$ yarn clean
```

### Deploy

Deploy the contracts to Hardhat Network:

```sh
$ yarn deploy --greeting "Bonjour, le monde!"
```

### Fix husky not executable

```sh
chmod ug+x .husky/*
chmod ug+x .git/hooks/*
```

## License

[MIT](./LICENSE.md) © Nguyễn Đình Trường
