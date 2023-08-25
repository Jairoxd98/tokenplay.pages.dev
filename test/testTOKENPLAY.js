const TOKENPLAY = artifacts.require("TOKENPLAY");

contract("TOKENPLAY Tests", async accounts => {
    let instance;

    before(async () => {
        instance = await TOKENPLAY.deployed();
    });

    // 1. Verificar flipMintState y el estado de mintIsActive
    it("should change the flipMintState correctly", async () => {
        await instance.flipMintState();
        const mintIsActive = await instance.mintIsActive();
        assert.equal(mintIsActive, true, "Después de llamar a flipMintState, mintIsActive debería ser true");
    });

    // 2. Añadir un NFT y verificar los detalles
    it("should add an NFT correctly", async () => {
        await instance.addNFT(10002, web3.utils.toWei("1", "ether"), accounts[1], 5, 10, 0, {from: accounts[0]});
        const nft = await instance.gamesInfo(10002);
        assert.equal(nft.price.toString(), web3.utils.toWei("1", "ether"), "El precio del NFT no se configuró correctamente");
        assert.equal(nft.supply.toString(), "5", "El suministro del NFT no se configuró correctamente");
        assert.equal(nft.gameOwnerAddress, accounts[1], "La dirección del propietario del juego no se configuró correctamente");
    });

    // 3. Comprar un NFT y verificar los balances
    it("should allow purchasing an NFT", async () => {
        // Balance inicial del usuario
        const initialBalanceUser = await web3.eth.getBalance(accounts[2]);

        await instance.purchaseNFT(10002, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        
        // Balance después de comprar
        const newBalanceUser = await web3.eth.getBalance(accounts[2]);

        // Precio del NFT
        const nft = await instance.gamesInfo(10002);
        const priceNFTInEth = web3.utils.fromWei(nft.price, 'ether');

        // Convertir de WEI a ETH
        const initialBalanceUserInEth = web3.utils.fromWei(initialBalanceUser, "ether");
        const newBalanceUserInEth = web3.utils.fromWei(newBalanceUser, "ether");

        // Balance esperado después de comprar
        const expectedBalanceInEth = parseFloat(initialBalanceUserInEth) - parseFloat(priceNFTInEth);

        assert.approximately(parseFloat(newBalanceUserInEth), expectedBalanceInEth, 0.01, "El balance de ether de la cuenta no se restó correctamente después de la compra");
    });
    
    // 4. Comprar un NFT y verificar la propiedad
    it("should allow purchasing an NFT", async () => {
        await instance.purchaseNFT(10002, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
        const balance = await instance.balanceOf(accounts[2], 10002);
        assert.equal(balance.toString(), "2", "El balance después de la compra no es el esperado");
    });
    
    // 5. Obtener los NFTs que posee una cuenta
    it("should return purchased NFTs for an account", async () => {
        const purchased = await instance.getPurchasedNFTs(accounts[2]);
        assert.equal(purchased.length, 1, "El número de NFTs comprados por la cuenta es incorrecto");
        assert.equal(purchased[0].game.tokenId.toString(), "10002", "El ID del NFT comprado no coincide con el esperado");
    });

    // 6. Modificar el royalty de un juego
    it("should change the royalty percentage correctly", async () => {
        await instance.setRoyaltyPercentage(10002, 15, {from: accounts[0]});
        const nft = await instance.gamesInfo(10002);
        assert.equal(nft.tokenPlayRoyaltyPercentage.toString(), "15", "El porcentaje de royalty no se configuró correctamente");
    });
    
    // 7. Modificar el precio de un juego
    it("should change the mint price correctly", async () => {
        await instance.setMintPrice(10002, web3.utils.toWei("2", "ether"), {from: accounts[0]});
        const nft = await instance.gamesInfo(10002);
        assert.equal(nft.price.toString(), web3.utils.toWei("2", "ether"), "El precio del NFT no se configuró correctamente");
    });
    
    // Flujos de compra:
    // 8. Compra sin suficiente ETH
    it("should fail if not enough Ether is sent", async () => {
        try {
            await instance.purchaseNFT(10002, {from: accounts[2], value: web3.utils.toWei("0.5", "ether")});
            assert.fail("The transaction should have reverted");
        } catch (error) {
            assert.include(error.message, "revert", "Expected a revert for insufficient funds");
        }
    });

    // 9. Compra NFT inexistente
    it("should fail to purchase a non-existent NFT", async () => {
        try {
            await instance.purchaseNFT(99999, {from: accounts[2], value: web3.utils.toWei("1", "ether")});
            assert.fail("The transaction should have reverted");
        } catch (error) {
            assert.include(error.message, "revert", "Expected a revert for non-existent NFT");
        }
    });

    // Flujos de suministro:
    // 10. Comprar un NFT con suministro agotado
    it("should fail if trying to purchase an NFT with depleted supply", async () => {
        await instance.addNFT(10003, web3.utils.toWei("1", "ether"), accounts[4], 5, 10, 0, {from: accounts[0]});
        // Primero se agota el suministro
        for(let i = 0; i < 5; i++) {
            await instance.purchaseNFT(10003, {from: accounts[i], value: web3.utils.toWei("1", "ether")});
        }

        try {
            await instance.purchaseNFT(10003, {from: accounts[4], value: web3.utils.toWei("1", "ether")});
            assert.fail("The transaction should have reverted");
        } catch (error) {
            assert.include(error.message, "revert", "Expected a revert for depleted supply");
        }
    });
    
    // 11. Suministro de NFT disminuye después de la compra
    it("should decrease the NFT supply after purchase", async () => {
        await instance.addNFT(10001, web3.utils.toWei("1", "ether"), accounts[2], 5, 10, 0, {from: accounts[0]});
        const initialSupply = await instance.totalSupply(10001);
    
        await instance.purchaseNFT(10001, {from: accounts[1], value: web3.utils.toWei("1", "ether")});
    
        const finalSupply = await instance.totalSupply(10001);
    
        assert.equal(finalSupply.toString(), (parseInt(initialSupply) - 1).toString(), "The NFT supply did not decrease correctly after purchase");
    });
    
});
