const TOKENPLAY = artifacts.require("TOKENPLAY");
const NFTGamesMarketplace = artifacts.require("NFTGamesMarketplace");

contract("NFTGamesMarketplace Tests", async accounts => {
    let tokenplayInstance;
    let marketplaceInstance;
    const seller = accounts[4];
    const buyer = accounts[1];

    before(async () => {
        tokenplayInstance = await TOKENPLAY.deployed();
        marketplaceInstance = await NFTGamesMarketplace.new(tokenplayInstance.address);
    });


    // 1. Creación y compra de un NFT con el contrato TOKENPLAY
    it("should add and buy an NFT correctly", async () => {
        await tokenplayInstance.flipMintState();
        await tokenplayInstance.addNFT(10001, web3.utils.toWei("1", "ether"), accounts[2], 5, 10, 0, {from: accounts[0]});
        await tokenplayInstance.purchaseNFT(10001, {from: accounts[4], value: web3.utils.toWei("1", "ether")});
        const balance = await tokenplayInstance.balanceOf(accounts[4], 10001);
        assert.equal(balance.toString(), "1", "El balance después de la compra no es el esperado");
        await tokenplayInstance.approveMarketplace(marketplaceInstance.address, { from: accounts[0] });
    });

    // 2. Verificar que un juego se puede listar correctamente para la venta
    it("should create a sale correctly", async () => {
        const price = web3.utils.toWei("1", "ether");
        await marketplaceInstance.createSale(10001, price, { from: seller });

        const sale = await marketplaceInstance.salesInfo(0);
        assert.equal(sale.tokenId.toString(), "10001", "Token ID is incorrect");
        assert.equal(sale.price.toString(), price, "Sale price is incorrect");
    });

    // Test para verificar que el vendedor puede cancelar una venta que ha creado
    it("should allow the seller to cancel a sale", async () => {
        await marketplaceInstance.cancelSale(0, { from: seller });
        const sale = await marketplaceInstance.salesInfo(0);
        assert.equal(sale.status.toString(), "2", "Sale status should be Canceled (2)");
    });

    // Test para verificar que el vendedor puede actualizar el precio de venta
    it("should allow the seller to update the sale price", async () => {
        // Re-list del anuncio de venta
        const price = web3.utils.toWei("1", "ether");
        await marketplaceInstance.createSale(10001, price, { from: seller });

        const newPrice = web3.utils.toWei("2", "ether");
        await marketplaceInstance.updateSalePrice(1, newPrice, { from: seller });
        const sale = await marketplaceInstance.salesInfo(1);
        assert.equal(sale.price.toString(), newPrice, "Sale price should be updated");
    });

    // Test para verificar que un comprador puede comprar un juego listado en el mercado
    it("should allow purchasing a game from the marketplace", async () => {
        const price = web3.utils.toWei("2", "ether");
        await marketplaceInstance.purchaseFromMarketplace(1, { from: buyer, value: price });
        const sale = await marketplaceInstance.salesInfo(1);
        assert.equal(sale.status.toString(), "1", "Sale status should be Sold (1)");
    });

    // Test para verificar que el propietario puede establecer el porcentaje de comisión
    it("should allow owner to set commission percentage", async () => {
        await marketplaceInstance.setCommissionPercentage(10, { from: accounts[0] });
        const commission = await marketplaceInstance.getCommissionPercentage();
        assert.equal(commission.toString(), "10", "Commission percentage should be 10");
    });
});
