// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract TOKENPLAY is ERC1155, ERC1155URIStorage, Ownable {
    using Strings for uint256;

    string public name = "TOKENPLAY";

    string public symbol = "TKP";

    uint256 public mintPrice = 10000000000000000; // 0.01 ETH

    bool public mintIsActive = false;

    uint256 public royaltyPercentage = 10; // % royalties

    uint256 public supplyNFT = 10;

    mapping(uint256 => address) public wineries;

    mapping(uint256 => uint256) public _totalSupply;

    mapping(uint256 => uint256) public royaltiesPendingWithdrawal;

    event Minted(address indexed minter, uint256 indexed tokenId);

    constructor (string memory _baseURI /*,uint256 supply*/) ERC1155(_baseURI) {
        //supplyNFT = supply;
        _setBaseURI(_baseURI);
    }

    function setRoyaltyPercentage(uint256 percentage) public onlyOwner {
        royaltyPercentage = percentage;
    }    

    function _exists(uint256 tokenId) internal view virtual returns (bool) {
        return wineries[tokenId] != address(0);
    }

    function _requireMinted(uint256 tokenId) internal view virtual {
        require(_exists(tokenId), "Invalid token ID");
    }

    function setBaseURI(string memory baseURI) public onlyOwner {
        _setBaseURI(baseURI);
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

    function flipMintState() public onlyOwner {
        mintIsActive = ! mintIsActive;
    }

    function withdraw() public onlyOwner {
        uint balance = address(this).balance;

        payable(msg.sender).transfer(balance);
    }

    function mint(uint256 tokenId) public payable {
        require(mintIsActive, "Mint must be active to mint");
        require(mintPrice == msg.value, "Value sent is not correct");
        require(!_exists(tokenId), "Game already minted");
        require(supplyNFT > 0, "The supply must be higher than 0");

        wineries[tokenId] = msg.sender;

        _mint(msg.sender, tokenId, supplyNFT, "");
        _setURI(tokenId, string(abi.encodePacked(tokenId.toString(), ".json")));

        _totalSupply[tokenId] = supplyNFT;

        emit Minted(msg.sender, tokenId);
    }
    /*
    function safeTransferFrom(address from, address to, uint256 tokenId, uint256 amount, bytes memory data) public override {
        _requireMinted(tokenId);

        // Calcular el monto de royalties a pagar al propietario original
        uint256 royaltyAmount = (amount * royaltyPercentage) / 100;
        uint256 transferAmount = amount - royaltyAmount;

        // Transferir el NFT al nuevo propietario
        _safeTransferFrom(from, to, tokenId, transferAmount, data);

        // Pagar los royalties al propietario original
        //if (royaltyAmount > 0) {
        //    payable(address(this)).transfer(royaltyAmount);
        //}
        // Guardar los royalties en el contrato para que el propietario pueda retirarlos más tarde
        royaltiesPendingWithdrawal[tokenId] += royaltyAmount;

    }

    function withdrawRoyalties(uint256 tokenId) public {
        require(royaltiesPendingWithdrawal[tokenId] > 0, "No royalties to withdraw");
        require(msg.sender == wineries[tokenId], "Only the original owner can withdraw royalties");

        uint256 amount = royaltiesPendingWithdrawal[tokenId];
        royaltiesPendingWithdrawal[tokenId] = 0; // Resetea el saldo pendiente

        payable(msg.sender).transfer(amount);
    }
    */

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        _requireMinted(tokenId);

        return super.uri(tokenId);
    }

    function totalSupply(uint256 tokenId) public view returns (uint256) {
        return _totalSupply[tokenId];
    }
}
