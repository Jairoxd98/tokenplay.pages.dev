// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./TOKENPLAY.sol";

contract NFTGamesMarketplace is Ownable, ERC1155Holder, ReentrancyGuard, Pausable {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    TOKENPLAY private nftContract; // Referencia al contrato original

    constructor(address _nftContract) {
        nftContract = TOKENPLAY(_nftContract);
    }

    // Contador autoincremental, cada número será una venta
    uint256 public nextSaleId = 0;
    // % royalties
    uint256 public commissionPercentage = 5;

    // Enum para el estado de la venta
    enum SaleStatus { Listed, Sold, Canceled }

    // Estructura para poner a la venta un juego
    struct Sale {
        uint256 saleId;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 arrayPosition;
        SaleStatus status;
    }

    mapping(uint256 => Sale) public salesInfo;
    Sale[] public sales;

    // EVENTOS
    // Publicación de la venta de un juego
    event SaleCreated(uint256 indexed saleId, uint256 indexed tokenId, address indexed seller, uint256 price);
    // Cancelación de una publicación
    event SaleCanceled(uint256 indexed saleId, address indexed seller);
    // Cuando alguien compra un juego en el mercado
    event GamePurchasedFromMarketplace(uint256 indexed saleId, uint256 indexed tokenId, address indexed buyer, uint256 purchasePrice);
    // Modificar precio de venta
    event SalePriceUpdated(uint256 indexed saleId, uint256 newPrice, address indexed seller);
    // Modificar % royalty
    event CommissionUpdated(uint256 newCommissionPercentage);

    // Crear una venta de juego
    function createSale(uint256 tokenId, uint256 price) external payable nonReentrant whenNotPaused {
        require(nftContract.balanceOf(msg.sender, tokenId) > 0, "You don't own this NFT");
        require(price > 0, "The price must be positive");

        nftContract.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");

        uint256 saleId = nextSaleId;
        nextSaleId = nextSaleId.add(1);

        Sale memory sale = Sale({saleId: saleId, tokenId: tokenId, seller: msg.sender, price: price, arrayPosition: sales.length, status: SaleStatus.Listed});
        sales.push(sale);
        salesInfo[saleId] = sale;
    }

    function cancelSale(uint256 saleId) payable external whenNotPaused {
        require(saleId >= 0, "Invalid sale id");

        Sale storage saleMapping = salesInfo[saleId];
        require(saleMapping.seller == msg.sender, "You are not the seller");
        require(saleMapping.status != SaleStatus.Canceled, "The sale has already been canceled");
        require(saleMapping.status != SaleStatus.Sold, "The sale has been sold");
        require(saleMapping.arrayPosition < sales.length, "Strange error, contact with administrators (1)");

        Sale memory saleArray = sales[saleMapping.arrayPosition];
        require(saleMapping.saleId == saleArray.saleId, "Strange error, contact with administrators (2)");

        saleMapping.status = SaleStatus.Canceled;
        // Reorganizar el array moviendo el último elemento al lugar del elemento eliminado
        if (saleMapping.arrayPosition < sales.length - 1) {
            Sale storage lastSale = sales[sales.length - 1];

            // Actualizamos posiciones
            lastSale.arrayPosition = saleMapping.arrayPosition;
            salesInfo[lastSale.saleId].arrayPosition = saleMapping.arrayPosition;

            // Guardamos elemento en la nueva posición del array
            sales[saleMapping.arrayPosition] = lastSale;
        }
        sales.pop();

        nftContract.safeTransferFrom(address(this), msg.sender, saleMapping.tokenId, 1, "");
        emit SaleCanceled(saleId, msg.sender);
    }

    function purchaseFromMarketplace(uint256 saleId) external payable whenNotPaused {
        require(saleId >= 0, "Invalid sale id");

        Sale storage saleMapping = salesInfo[saleId];
        require(saleMapping.status != SaleStatus.Canceled, "The sale has already been canceled");
        require(saleMapping.status != SaleStatus.Sold, "The sale has been sold");
        require(msg.value >= saleMapping.price, "Insufficient funds");
        require(saleMapping.arrayPosition < sales.length, "Strange error, contact with administrators (1)");

        Sale memory saleArray = sales[saleMapping.arrayPosition];
        require(saleMapping.saleId == saleArray.saleId, "Strange error, contact with administrators (2)");

        // Reorganizar el array moviendo el último elemento al lugar del elemento eliminado
        saleMapping.status = SaleStatus.Sold;
        if (saleMapping.arrayPosition < sales.length - 1) {
            Sale storage lastSale = sales[sales.length - 1];

            // Actualizamos posiciones
            lastSale.arrayPosition = saleMapping.arrayPosition;
            salesInfo[lastSale.saleId].arrayPosition = saleMapping.arrayPosition;

            // Guardamos elemento en la nueva posición del array
            sales[saleMapping.arrayPosition] = lastSale;
        }
        sales.pop();

        nftContract.safeTransferFrom(address(this), msg.sender, saleMapping.tokenId, 1, "");

        // Deducción de la comisión y transferencia al propietario del contrato
        uint256 commissionAmount = saleMapping.price.mul(commissionPercentage).div(100);
        uint256 sellerAmount = saleMapping.price.sub(commissionAmount);

        payable(saleMapping.seller).transfer(sellerAmount);
        payable(owner()).transfer(commissionAmount);

        // Si el usuario ha pagado de mas, le devolvemos el dinero
        if (msg.value > saleMapping.price) {
            payable(msg.sender).transfer(msg.value - saleMapping.price);
        }
        emit GamePurchasedFromMarketplace(saleId, saleMapping.tokenId, msg.sender, saleMapping.price);
    }

    // Función para obtener los juegos en venta
    function getGamesForSale() external view returns (Sale[] memory) {
        uint256 activeSalesCount = 0;

        // Contar la cantidad de ventas activas
        for (uint256 i = 0; i < sales.length; i++) {
            if (sales[i].status == SaleStatus.Listed) {
                activeSalesCount++;
            }
        }

        // Crear un array para almacenar las ventas activas
        Sale[] memory activeSales = new Sale[](activeSalesCount);

        // Llenar el array con las ventas activas
        uint256 activeIndex = 0;
        for (uint256 i = 0; i < sales.length; i++) {
            if (sales[i].status == SaleStatus.Listed) {
                activeSales[activeIndex] = sales[i];
                activeIndex++;
            }
        }

        return activeSales;
    }

    // Función para actualizar el precio de venta
    function updateSalePrice(uint256 saleId, uint256 newPrice) external {
        require(saleId >= 0, "Invalid sale id");
        require(newPrice > 0, "The price must be positive");
        require(salesInfo[saleId].status == SaleStatus.Listed, "Must be listed");

        Sale storage saleMapping = salesInfo[saleId];
        require(saleMapping.seller == msg.sender, "You are not the seller");
        require(saleMapping.status == SaleStatus.Listed, "The sale is not active");

        saleMapping.price = newPrice;

        emit SalePriceUpdated(saleId, newPrice, msg.sender);
    }

    function setCommissionPercentage(uint256 _commissionPercentage) external onlyOwner {
        require(_commissionPercentage >= 0 && _commissionPercentage <= 100, "Invalid commission percentage");
        commissionPercentage = _commissionPercentage;
        emit CommissionUpdated(_commissionPercentage);
    }

    function getCommissionPercentage() external view returns (uint256) {
        return commissionPercentage;
    }
}
