const TOKENPLAY = artifacts.require("TOKENPLAY");
const NFTGamesMarketplace = artifacts.require("NFTGamesMarketplace");

module.exports = async function(deployer) {
  await deployer.deploy(TOKENPLAY, 'https://ipfs.io/ipfs/QmaCGRMaT7FFsJzXQ1bmVvwBsXhTNAW5APrhDh67AGXLoz/');
  const tokenplayInstance = await TOKENPLAY.deployed();

  await deployer.deploy(NFTGamesMarketplace, tokenplayInstance.address);
};

