const TOKENPLAY = artifacts.require("TOKENPLAY");
const NFTGamesMarketplace = artifacts.require("NFTGamesMarketplace");

module.exports = async function (callback) {
  let accounts = await web3.eth.getAccounts();

  // Deploy TOKENPLAY
  var tokenplayInstance = await TOKENPLAY.deployed();

  // Deploy NFTGamesMarketplace
  var marketplaceInstance = await NFTGamesMarketplace.deployed();

  const seller = accounts[4];
  const buyer = accounts[1];
  // Se da de alta en el market
  await tokenplayInstance.approveMarketplace(marketplaceInstance.address, { from: seller });

  const price = web3.utils.toWei("1", "ether");
  try{
    // Crea anuncio
    await marketplaceInstance.createSale(10006, price, { from: seller });
    const gameMarket = await marketplaceInstance.getGamesForSale();
    console.log(gameMarket);

    // // Cancela anuncio
    // await marketplaceInstance.cancelSale(0, { from: seller });
    // console.log(await marketplaceInstance.getGamesForSale());

    // // Crea anuncio
    // await marketplaceInstance.createSale(10007, price, { from: seller });
    // console.log(await marketplaceInstance.getGamesForSale());

    // // Compra anuncio
    // await marketplaceInstance.purchaseFromMarketplace(1, { from: buyer, value: price });
    // console.log(await marketplaceInstance.getGamesForSale());

  }
  catch (error) {
    console.error("Error:", error);
  }

  callback();
};
