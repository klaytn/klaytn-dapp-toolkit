// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165CheckerUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./interfaces/INFT.sol";

error ImplementationNotERC721();
error IndexOutOfBounds();

contract NFTFactory is Initializable, Ownable2StepUpgradeable {
    using ERC165CheckerUpgradeable for address;

    // Address of the NFT implementation contract
    address public implementation;

    // Mapping of owner to number of NFT contracts created
    mapping(address => uint256) private nftCounts;

    // Mapping of index to NFT contract address
    mapping(address => mapping(uint256 => address)) private nfts;

    function initialize(address _implementation) public initializer {
        __Ownable2Step_init();
        _setImplementation(_implementation);
    }

    // ------- Events -------
    event NFTCreated(address indexed owner, address clone);
    event ImplementationChanged(address implementation);

    // ------- Getters -------
    /**
     * @dev Returns the number of NFT contracts created by the owner
     * @param owner Owner of the NFT contracts
     * @return count Number of NFT contracts created by the owner
     */
    function getNFTCount(address owner) external view returns (uint256 count) {
        count = nftCounts[owner];
    }

    /**
     * @dev Returns the NFT contract address at the index
     * @param owner Owner of the NFT contracts
     * @param index Index of the NFT contract
     * @return nft Address of the NFT contract
     */
    function getNFT(
        address owner,
        uint256 index
    ) external view returns (address nft) {
        if (index >= nftCounts[owner]) {
            revert IndexOutOfBounds();
        }
        nft = nfts[owner][index];
    }

    // ------- External functions -------

    /**
     * @dev Sets the implementation address of the proxy
     * @param _implementation Address of the implementation
     * @notice This function can only be called by the owner
     */
    function setImplementation(address _implementation) external onlyOwner {
        _setImplementation(_implementation);
    }

    /**
     * @dev Creates a new NFT contract
     * @param name Name of the token
     * @param symbol Symbol of the token
     * @param initUri URI of the token id 0
     * @return nft Address of the new NFT contract
     */
    function createNFT(
        string calldata name,
        string calldata symbol,
        string calldata initUri
    ) external returns (address nft) {
        nft = ClonesUpgradeable.clone(implementation);
        INFT(nft).initialize(name, symbol, initUri, msg.sender);

        nfts[msg.sender][nftCounts[msg.sender]++] = nft;

        emit NFTCreated(msg.sender, nft);
    }

    // ------- Internal functions -------

    /**
     * @dev Sets the implementation address of the nft
     * @param _implementation Address of the implementation
     * @notice Revert if the implementation does not support ERC721 interface
     */
    function _setImplementation(address _implementation) internal {
        if (
            !_implementation.supportsInterface(
                type(IERC721Upgradeable).interfaceId
            )
        ) {
            revert ImplementationNotERC721();
        }

        implementation = _implementation;

        emit ImplementationChanged(_implementation);
    }
}
