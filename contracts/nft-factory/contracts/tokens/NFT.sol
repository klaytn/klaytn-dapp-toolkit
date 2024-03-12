// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts-upgradeable/access/Ownable2StepUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "../interfaces/INFT.sol";

error OnlyMinter();
error StatusSet();

contract NFT is
    INFT,
    Initializable,
    ERC721URIStorageUpgradeable,
    ERC721EnumerableUpgradeable,
    Ownable2StepUpgradeable
{
    /**
     * @dev Mapping of minters who has capability of minting new tokens
     */
    mapping(address => bool) private minters;

    // ------- Events -------
    event MinterSet(address indexed account, bool status);

    /**
     * @dev Initializes the contract
     * @param name Name of the token
     * @param symbol Symbol of the token
     * @param initUri URI of the token id 0
     * @param owner Owner of the contract
     */
    function initialize(
        string calldata name,
        string calldata symbol,
        string calldata initUri,
        address owner
    ) public initializer {
        __ERC721_init(name, symbol);
        _transferOwnership(owner);

        _safeMint(owner, 0);
        _setTokenURI(0, initUri);

        _setMinter(owner, true);
    }

    modifier onlyMinter() {
        if (!minters[msg.sender]) {
            revert OnlyMinter();
        }
        _;
    }

    // ------- External functions -------

    function isMinter(address account) external view returns (bool) {
        return minters[account];
    }

    /**
     * @dev Adds minter
     * @param account Address of the minter
     * @notice Only owner can add minter
     * @notice If the minter is already added, it will revert
     */
    function addMinter(address account) external onlyOwner {
        if (minters[account]) {
            revert StatusSet();
        }
        _setMinter(account, true);
    }

    /**
     * @dev Removes minter
     * @param account Address of the minter
     * @notice Only owner can remove minter
     * @notice If the minter is not added, it will revert
     */
    function removeMinter(address account) external onlyOwner {
        if (!minters[account]) {
            revert StatusSet();
        }
        _setMinter(account, false);
    }

    /**
     * @dev Mints new token
     * @param to Address of the token receiver
     * @param _tokenURI URI of the token
     * @notice Only minter can mint new token
     */
    function mint(address to, string memory _tokenURI) external onlyMinter {
        uint256 tokenId = totalSupply();

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
    }

    // ------- Internal functions -------

    function _setMinter(address account, bool status) internal {
        minters[account] = status;
        emit MinterSet(account, status);
    }

    // ------- Overrides -------
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function _burn(
        uint256 tokenId
    ) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721URIStorageUpgradeable, ERC721EnumerableUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(
        uint256 tokenId
    )
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
