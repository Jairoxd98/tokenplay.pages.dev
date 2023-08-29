const TOKENPLAY = artifacts.require("contracts/TOKENPLAY");

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
    await _TOKENPLAY.addNFT(20004,priceNFT,accounts[2],3,10,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(20004, {from: accounts[1], value: 1000000000000000000 });

    await _TOKENPLAY.addNFT(20005,priceNFT,accounts[2],3,10,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(20005, {from: accounts[1], value: 1000000000000000000 });

    await _TOKENPLAY.addNFT(20006,priceNFT,accounts[2],3,10,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(20006, {from: accounts[1], value: 1000000000000000000 });

    await _TOKENPLAY.flipMintState();

    callback();
}