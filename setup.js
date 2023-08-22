const TOKENPLAY = artifacts.require("TOKENPLAY");

module.exports = async function (callback) {
    var _TOKENPLAY = await TOKENPLAY.deployed();

    var mintIsActive = await _TOKENPLAY.mintIsActive();

    if (!mintIsActive) {
        await _TOKENPLAY.flipMintState();
    }

    let accounts = await web3.eth.getAccounts();
    //console.log(accounts);
 
    let priceNFT = web3.utils.toBN("1000000000000000000");
    //console.log(priceNFT);
    await _TOKENPLAY.addNFT(10001,priceNFT,accounts[0],3,10,0);

    await _TOKENPLAY.purchaseNFT(10001, {from: accounts[1], value: 1000000000000000000 });

    await _TOKENPLAY.flipMintState();

    callback();
}