// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract NFTGames is ERC1155, ERC1155URIStorage, Ownable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    uint256 public royaltyPercentage = 10; // % royalties
    bool public mintIsActive = false;

    // Estructura para guardar los datos relevantes del NFT
    struct NftGameInfo {
        string name;
        string description;
        string imageUrl;
        uint256 tokenId;
        uint256 price;
        address gameOwnerAddress;
    }

    constructor(string memory _uri) ERC1155(_uri) {}

    // Contador autoincremental, cada número será un juego (token)
    uint256 public nextTokenId = 1;
    // Estructura, donde por cada juego definiremos el precio
    mapping(uint256 => NftGameInfo) public gamesInfo;
    mapping(address => EnumerableSet.UintSet) private purchasedNFTs;

    // Función para añadir un juego (crear un token)
    function addNFT(string memory name, string memory description, string memory imageUrl, uint256 price, address gameOwnerAddress) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId = nextTokenId.add(1);

        gamesInfo[tokenId] = NftGameInfo(name, description, imageUrl, tokenId, price, gameOwnerAddress);
    }

    // Función para comprar un juego (un token)
    function purchaseNFT(uint256 tokenId) external payable {
        require(mintIsActive, "Mint is not active");
        require(tokenId > 0 && tokenId < nextTokenId, "Invalid token ID");
        uint256 price = gamesInfo[tokenId].price;
        require(msg.value >= price, "Insufficient funds");

        // Minteamos el NFT al comprador y registramos al array de juegos que tiene comprados (si el Id ya existe no lo registramos de nuevo)
        _mint(msg.sender, tokenId, 1, "");
        if (!purchasedNFTs[msg.sender].contains(tokenId)) {
            purchasedNFTs[msg.sender].add(tokenId);
        }

        // Calculamos los porcentajes que se lleva cada parte y hacemos la transferencia de los tokens
        uint256 paymentAmount = price; // Assuming the minting function is payable
        uint256 gameOwner = paymentAmount.mul(royaltyPercentage).div(100); // royaltypercentage for the game owner
        uint256 tokenPlay = paymentAmount.sub(gameOwner);  // restant for tokenplay

        payable(owner()).transfer(tokenPlay);
        payable(gamesInfo[tokenId].gameOwnerAddress).transfer(gameOwner);

        // Si el usuario ha pagado de mas, le devolvemos el dinero
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function getPurchasedNFTs(address account) external view returns (uint256[] memory) {
        uint256[] memory tokens = new uint256[](purchasedNFTs[account].length());

        for (uint256 i = 0; i < purchasedNFTs[account].length(); i++) {
            tokens[i] = purchasedNFTs[account].at(i);
        }

        return tokens;
    }

    // Función para que el propietario retire los fondos acumulados
    function withdrawBalance() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Función para cambiar el porcentaje de royalty que nos llevamos
    function setRoyaltyPercentage(uint256 percentage) public onlyOwner {
        royaltyPercentage = percentage;
    }

    // Función para activar o desactivar la compra de juegos (tokens)
    function flipMintState() public onlyOwner {
        mintIsActive = ! mintIsActive;
    }

    // Override de la función porque el estándard ERC1155 lo exige
    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        require(tokenId > 0 && tokenId < nextTokenId, "Invalid token ID");
        return gamesInfo[tokenId].imageUrl;
    }
}