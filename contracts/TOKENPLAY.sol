// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";


contract TOKENPLAY is ERC1155, ERC1155URIStorage, Ownable {
    using SafeMath for uint256;
    using Strings for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    bool public mintIsActive = false;

    // Estructura para guardar los datos relevantes del NFT
    struct NftGameInfo {
        uint256 tokenId;
        uint256 price;
        address gameOwnerAddress;
        uint256 supply;
        uint256 tokenPlayRoyaltyPercentage;
        uint256 gameRelease;
    }

    // Estructura para devolver los juegos que ha comprado un usuario y la cantidad que tiene de cada juego
    struct PurchasedNft {
        NftGameInfo game;
        uint256 qty;
    }

    constructor(string memory _baseURI) ERC1155(_baseURI) {
        _setBaseURI(_baseURI);
    }

    // Contador autoincremental, cada número será un juego (token)
    uint256 public nextTokenId = 0;

    // Estructura, donde por cada juego definiremos el precio
    mapping(uint256 => NftGameInfo) public gamesInfo;
    mapping(address => EnumerableSet.UintSet) private purchasedNFTs;

    // Contador de juegos
    mapping(uint256 => uint256) public nGames;

    // Estructura para definir el supply de cada juego
    mapping(uint256 => uint256) public _totalSupply;

    // Evento para notificar que se ha realizado el mint
    event Purchased(address indexed minter, uint256 indexed tokenId);

    // Función para comprobar que existe el token
    function _exists(uint256 tokenTest) internal view virtual returns (bool) {
        return gamesInfo[tokenTest].tokenId == tokenTest;
    }

    // Función para añadir un juego (crear un token)
    function addNFT(uint256 tokenId,uint256 price, address gameOwnerAddress, uint256 supply, uint256 tokenPlayRoyaltyPercentage, uint256 gameRelease ) external onlyOwner {
        require(!_exists(tokenId), "Token ID already exists");
        require(price > 0, "Invalid price");
        require( gameOwnerAddress != address(0), "Invalid address");
        require(supply > 0, "Invalid supply");
        require(tokenPlayRoyaltyPercentage >= 0, "Invalid percentage royalty");
        require(gameRelease >= 0, "Time must be positive");

        // Contabilizamos el juego añadido
        nGames[nextTokenId] = tokenId;
        nextTokenId = nextTokenId.add(1);

        gamesInfo[tokenId] = NftGameInfo(tokenId, price, gameOwnerAddress, supply, tokenPlayRoyaltyPercentage, gameRelease);

    }

    // Función para comprar un juego (un token)
    function purchaseNFT(uint256 tokenId) external payable {
        require(mintIsActive, "Mint must be active to mint");
        require(nextTokenId > 0, "No games created");
        require(_exists(tokenId), "Game ID must be created");
        uint256 price = gamesInfo[tokenId].price;
        require(msg.value >= price, "Insufficient funds"); 
        require(gamesInfo[tokenId].supply > 0, "Insufficient supply. It's over.");
        require(gamesInfo[tokenId].gameRelease <= block.timestamp, "Game not released yet");
        
        // Minteamos el NFT al comprador y registramos al array de juegos que tiene comprados (si el Id ya existe no lo registramos de nuevo)
        _mint(msg.sender, tokenId, 1, "");
        if (!purchasedNFTs[msg.sender].contains(tokenId)) {
            purchasedNFTs[msg.sender].add(tokenId);
        }

        // Asignamos el URI al juego con el ID y la extensión
        _setURI(tokenId, string(abi.encodePacked(tokenId.toString(), ".json")));

        // Restamos del supply total el juego comprado
        gamesInfo[tokenId].supply = gamesInfo[tokenId].supply.sub(1);
        // Guardamos el supply del NFT
        _totalSupply[tokenId] = gamesInfo[tokenId].supply;


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

        emit Purchased(msg.sender, tokenId);
    }
    
    // Funcion para obtener los juegos que ha comprado un usuario
    function getPurchasedNFTs(address account) external view returns (PurchasedNft[] memory) {
        require( account != address(0), "Invalid address");
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
        require(nextTokenId > 0, "No games created");

        NftGameInfo[] memory allNFTs = new NftGameInfo[](nextTokenId);

        for (uint256 i = 0; i < nextTokenId; i++) {
            if (gamesInfo[nGames[i]].gameRelease <= block.timestamp) {
                NftGameInfo storage nftInfo = gamesInfo[nGames[i]]; 
                allNFTs[i] = nftInfo;
            }
        }

        return allNFTs;
    }

    // Función para cambiar el porcentaje de royalty que nos llevamos
    function setRoyaltyPercentage(uint256 tokenId, uint256 royaltyPercentage) public onlyOwner {
        require(royaltyPercentage >= 0, "Must be a positive number");
        gamesInfo[tokenId].tokenPlayRoyaltyPercentage = royaltyPercentage;
    }

    // Funcion para cambiar el precio del juego
    function setMintPrice(uint256 tokenId, uint256 _mintPrice) public onlyOwner {
        require(_exists(tokenId), "Game ID must be created");
        require(_mintPrice >= 0, "The price must be positive");
        gamesInfo[tokenId].price = _mintPrice;
    }

    // Funcion para saber el supply de un juego
    function totalSupply(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "Game ID must be created");
        return _totalSupply[tokenId];
    }

    // Función para activar o desactivar la compra de juegos (tokens)
    function flipMintState() public onlyOwner {
        mintIsActive = ! mintIsActive;
    }

    // Funcion para obtener el URI de un juego
    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        require(_exists(tokenId), "Game ID must be created");

        return super.uri(tokenId);
    }

    // Función para modificar el URI del juego
    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI);
    }

    // Funcion para dar de alta el mercado secundario
    function approveMarketplace(address marketplace) external onlyOwner{
        require(marketplace != address(0), "The marketplace address is incorrect");
        setApprovalForAll(marketplace, true);
    }
    /*
    // Función para obtener los juegos de una categoria
    function getCategoryNFTs(string memory category) external view returns (NftGameInfo[] memory) {
        NftGameInfo[] memory matchingNFTs;
        uint256 matchingCount = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            NftGameInfo storage nftInfo = gamesInfo[i]; // habría que cambiar la i
            if(gamesInfo[i].gameRelease <= block.timestamp && keccak256(abi.encodePacked(nftInfo.category)) == keccak256(abi.encodePacked(category))){
                matchingCount++;
            }
        }

        matchingNFTs = new NftGameInfo[](matchingCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < nextTokenId; i++) {
            NftGameInfo storage nftInfo = gamesInfo[i]; // habría que cambiar la i
            if(gamesInfo[i].gameRelease <= block.timestamp && keccak256(abi.encodePacked(nftInfo.category)) == keccak256(abi.encodePacked(category))){
                matchingNFTs[currentIndex] = nftInfo;
                currentIndex++;
            }
        }

        return matchingNFTs;
    }
    */
}
