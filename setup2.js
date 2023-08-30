const TOKENPLAY = artifacts.require("TOKENPLAY");
const NFTGamesMarketplace = artifacts.require("NFTGamesMarketplace");

module.exports = async function (callback) {
  let accounts = await web3.eth.getAccounts();

  // Deploy TOKENPLAY
  var tokenplayInstance = await TOKENPLAY.deployed();

  // Deploy NFTGamesMarketplace
  //const marketplaceInstance = await NFTGamesMarketplace.new(tokenplayInstance.address, { from: accounts[0] });
  var marketplaceInstance = await NFTGamesMarketplace.deployed();

  // Aprobación del marketplace en el contrato TOKENPLAY
  const seller = accounts[4];
  await tokenplayInstance.approveMarketplace(marketplaceInstance.address, { from: seller });

  // Creación de una venta en el contrato NFTGamesMarketplace
  const price = web3.utils.toWei("1", "ether");
  console.log(price);
  try{
    await marketplaceInstance.createSale(10002, price, { from: seller });
    console.log(true); // Peta aquí
  }
  catch (error) {
    console.error("Error:", error);
  }

  // Obtener información sobre los juegos en venta y realizar algunas comprobaciones
  const gamesForSale = await marketplaceInstance.getGamesForSale();
  console.log(gamesForSale);
  console.log(true);

  const sale = await marketplaceInstance.salesInfo(0);
  console.log(sale);
  const sale1 = await marketplaceInstance.salesInfo(1);
  console.log(sale1);

  callback();
};
