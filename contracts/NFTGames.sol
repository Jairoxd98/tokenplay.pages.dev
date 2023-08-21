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

    bool public mintIsActive = false;

    // Estructura para guardar los datos relevantes del NFT
    struct NftGameInfo {
        string name;
        string description;
        string category;
        string imageUrl;
        uint256 tokenId;
        uint256 price;
        uint256 gameRelease;
        uint256 tokenPlayRoyaltyPercentage;
        address gameOwnerAddress;
    }

    // Estructura para devolver los juegos que ha comprado un usuario y la cantidad que tiene de cada juego
    struct PurchasedNft {
        NftGameInfo game;
        uint256 qty;
    }

    constructor(string memory _uri) ERC1155(_uri) {}

    // Contador autoincremental, cada número será un juego (token)
    uint256 public nextTokenId = 0;

    // Estructura, donde por cada juego definiremos el precio
    mapping(uint256 => NftGameInfo) public gamesInfo;
    mapping(address => EnumerableSet.UintSet) private purchasedNFTs;

    // Función para añadir un juego (crear un token)
    function addNFT(string memory name, string memory description, string memory category, string memory imageUrl, uint256 price, uint256 gameRelease, uint256 tokenPlayRoyaltyPercentage, address gameOwnerAddress) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId = nextTokenId.add(1);

        gamesInfo[tokenId] = NftGameInfo(name, description, category, imageUrl, tokenId, price, gameRelease, tokenPlayRoyaltyPercentage, gameOwnerAddress);
    }

    // Función para comprar un juego (un token)
    function purchaseNFT(uint256 tokenId) external payable {
        require(mintIsActive, "Mint is not active");
        require(tokenId >= 0 && tokenId < nextTokenId, "Invalid token ID");
        uint256 price = gamesInfo[tokenId].price;
        require(msg.value >= price, "Insufficient funds");
        require(gamesInfo[tokenId].gameRelease <= block.timestamp, "Game not released yet");

        // Minteamos el NFT al comprador y registramos al array de juegos que tiene comprados (si el Id ya existe no lo registramos de nuevo)
        _mint(msg.sender, tokenId, 1, "");
        if (!purchasedNFTs[msg.sender].contains(tokenId)) {
            purchasedNFTs[msg.sender].add(tokenId);
        }

        // Calculamos los porcentajes que se lleva cada parte y hacemos la transferencia de los tokens
        uint256 paymentAmount = price;
        uint256 tokenPlay = paymentAmount.mul(gamesInfo[tokenId].tokenPlayRoyaltyPercentage).div(100); // royaltypercentage para token play
        uint256 gameOwner = paymentAmount.sub(tokenPlay);  // el restante para game owner

        payable(owner()).transfer(tokenPlay);
        payable(gamesInfo[tokenId].gameOwnerAddress).transfer(gameOwner);

        // Si el usuario ha pagado de mas, le devolvemos el dinero
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    // Funcion para obtener los juegos que ha comprado un usuario
    function getPurchasedNFTs(address account) external view returns (PurchasedNft[] memory) {
        require(account != address(0), "Invalid address");

        uint256 purchasedCount = purchasedNFTs[account].length();
        require(purchasedCount > 0, "The user has not purchased any NFTs");

        PurchasedNft[] memory accountGames = new PurchasedNft[](purchasedNFTs[account].length());

        for (uint256 i = 0; i < purchasedNFTs[account].length(); i++) {
            uint256 id = purchasedNFTs[account].at(i);
            accountGames[i].game = gamesInfo[id];
            accountGames[i].qty = balanceOf(account, id);
        }

        return accountGames;
    }

    // Función para obtener todos los juegos disponibles
    function getNFTs() external view returns (NftGameInfo[] memory) {
        NftGameInfo[] memory allNFTs = new NftGameInfo[](nextTokenId);

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (gamesInfo[i].gameRelease <= block.timestamp) {
                NftGameInfo storage nftInfo = gamesInfo[i];
                allNFTs[i] = nftInfo;
            }
        }

        return allNFTs;
    }

    // Función para obtener los juegos de una categoria
    function getCategoryNFTs(string memory category) external view returns (NftGameInfo[] memory) {
        NftGameInfo[] memory matchingNFTs;
        uint256 matchingCount = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            NftGameInfo storage nftInfo = gamesInfo[i];
            if(gamesInfo[i].gameRelease <= block.timestamp && keccak256(abi.encodePacked(nftInfo.category)) == keccak256(abi.encodePacked(category))){
                matchingCount++;
            }
        }

        matchingNFTs = new NftGameInfo[](matchingCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            NftGameInfo storage nftInfo = gamesInfo[i];
            if(gamesInfo[i].gameRelease <= block.timestamp && keccak256(abi.encodePacked(nftInfo.category)) == keccak256(abi.encodePacked(category))){
                matchingNFTs[currentIndex] = nftInfo;
                currentIndex++;
            }
        }

        return matchingNFTs;
    }

    // Función para que el propietario retire los fondos acumulados
    function withdrawBalance() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Función para cambiar el porcentaje de royalty que nos llevamos
    function setRoyaltyPercentage(uint256 tokenId, uint256 royaltyPercentage) public onlyOwner {
        require(tokenId >= 0 && tokenId < nextTokenId, "Invalid token ID");

        gamesInfo[tokenId].tokenPlayRoyaltyPercentage = royaltyPercentage;
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

    function approveMarketplace(address marketplace) external {
        require(marketplace != address(0), "The marketplace address is incorrect");
        setApprovalForAll(marketplace, true);
    }
}
