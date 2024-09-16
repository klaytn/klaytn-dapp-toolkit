# Smart contract

## NFTFactory

This contract use Factory pattern, enables users to create their NFT contracts.

The `implementation` is the logic contract of NFT. Everytime someone calls `createNFT` function, a new NFT contract will be created using [minimal proxy pattern](https://eips.ethereum.org/EIPS/eip-1167) to minimize gas cost for creating new contract, this new proxy contract points to the `implementation` contract. An NFT with id 0 also be minted to user in this process with provided URI.

2 mappings `nftCounts` and `nfts` are used to save the deployed NFT address of users, they helps removing the need of a backend for indexing these data in this assignment (but also has a side effect that increase gas cost for create NFT)

## NFT

Since all of the id (except id 0) is reserved for later use, I implemented a map for store addresses with minter role, allow them to mint new NFTs. Only the owner of the NFT contract (is set to user who call the `createNFT` initially) can add or remove minters.

## Deployed addresses

Contracts are deployed on BNB Testnet:
| Contract Name | Address |
| ---------------- | ------------------------------------------ |
| NFTFactory | [`0x350538Ae3ca47319f83A67F4C70B9f57A5E18F2A`](https://testnet.bscscan.com/address/0x350538Ae3ca47319f83A67F4C70B9f57A5E18F2A#code)|
| NFTFactory implementation | [`0xF3A9715f055349D4578dB8814A48E235f9652FC3`](https://testnet.bscscan.com/address/0xF3A9715f055349D4578dB8814A48E235f9652FC3#code) |
| NFT Implementation| [`0x62DB5ed86d6412184Eb1F5156Ec8673452908AdA`](https://testnet.bscscan.com/address/0x62DB5ed86d6412184Eb1F5156Ec8673452908AdA#code) |
