const TOKENPLAY_MARKETPLACE = artifacts.require("contracts/NFTGamesMarketplace");

module.exports = async function (callback) {
    const _TOKENPLAY_MARKETPLACE = await TOKENPLAY_MARKETPLACE.deployed();

    callback();
}