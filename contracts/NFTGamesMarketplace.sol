// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./NFTGames.sol";

contract NFTGamesMarketplace is Ownable, ERC1155Holder  {
    using SafeMath for uint256;
    using EnumerableSet for EnumerableSet.UintSet;

    NFTGames private nftContract; // Referencia al contrato original

    constructor(address _nftContract) {
        nftContract = NFTGames(_nftContract);
    }

    // Contador autoincremental, cada número será una venta
    uint256 public nextSaleId = 0;

    // Estructura para poner a la venta un juego
    struct Sale {
        uint256 saleId;
        uint256 tokenId;
        address seller;
        uint256 price;
        uint256 arrayPosition;
        bool canceled;
        bool selled;
    }

    mapping(uint256 => Sale) public salesInfo;
    Sale[] public sales;

    // Crear una venta de juego
    function createSale(uint256 tokenId, uint256 price) payable external {
        require(nftContract.balanceOf(msg.sender, tokenId) > 0, "You don't own this NFT");

        nftContract.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");

        uint256 saleId = nextSaleId;
        nextSaleId = nextSaleId.add(1);

        Sale memory sale = Sale({saleId: saleId, tokenId: tokenId, seller: msg.sender, price: price, arrayPosition: sales.length, canceled: false, selled: false});
        sales.push(sale);
        salesInfo[saleId] = sale;
    }

    function cancelSale(uint256 saleId) payable external {
        require(saleId >= 0, "Invalid sale id");

        Sale storage saleMapping = salesInfo[saleId];
        require(saleMapping.seller == msg.sender, "You are not the seller");
        require(saleMapping.canceled == false, "The sale has already been canceled");
        require(saleMapping.selled == false, "The sale has been sold");
        require(saleMapping.arrayPosition < sales.length, "Strange error, contact with administrators (1)");

        Sale memory saleArray = sales[saleMapping.arrayPosition];
        require(saleMapping.saleId == saleArray.saleId, "Strange error, contact with administrators (2)");

        saleMapping.canceled = true;
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
    }

    function purchaseFromMarketplace(uint256 saleId) external payable {
        require(saleId >= 0, "Ivalid sale id");

        Sale storage saleMapping = salesInfo[saleId];
        require(saleMapping.canceled == false, "The sale is canceled");
        require(saleMapping.selled == false, "The sale is selled");
        require(msg.value >= saleMapping.price, "Insufficient funds");
        require(saleMapping.arrayPosition < sales.length, "Strange error, contact with administrators (1)");

        Sale memory saleArray = sales[saleMapping.arrayPosition];
        require(saleMapping.saleId == saleArray.saleId, "Strange error, contact with administrators (2)");

        // Reorganizar el array moviendo el último elemento al lugar del elemento eliminado
        saleMapping.selled = true;
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
        payable(saleMapping.seller).transfer(saleMapping.price);
        if (msg.value > saleMapping.price) {
            payable(msg.sender).transfer(msg.value - saleMapping.price);
        }
    }

    // Función para obtener los juegos en venta
    function getGamesForSale() external view returns (Sale[] memory) {
        uint256 activeSalesCount = 0;

        // Contar la cantidad de ventas activas
        for (uint256 i = 0; i < sales.length; i++) {
            if (!sales[i].canceled && !sales[i].selled) {
                activeSalesCount++;
            }
        }

        // Crear un array para almacenar las ventas activas
        Sale[] memory activeSales = new Sale[](activeSalesCount);

        // Llenar el array con las ventas activas
        uint256 activeIndex = 0;
        for (uint256 i = 0; i < sales.length; i++) {
            if (!sales[i].canceled && !sales[i].selled) {
                activeSales[activeIndex] = sales[i];
                activeIndex++;
            }
        }

        return activeSales;
    }
}
