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
    await _TOKENPLAY.addNFT(10004,priceNFT,accounts[2],7,10,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(10004, {from: accounts[1], value: 1000000000000000000 });

    await _TOKENPLAY.addNFT(10005,priceNFT,accounts[3],5,15,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(10005, {from: accounts[4], value: 1000000000000000000 });

    await _TOKENPLAY.addNFT(10006,priceNFT,accounts[5],4,18,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(10006, {from: accounts[6], value: 1000000000000000000 });

    await _TOKENPLAY.flipMintState();

    callback();
}