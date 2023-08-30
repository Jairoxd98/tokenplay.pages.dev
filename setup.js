const TOKENPLAY = artifacts.require("contracts/TOKENPLAY");

module.exports = async function (callback) {
    var _TOKENPLAY = await TOKENPLAY.deployed();

    // var mintIsActive = await _TOKENPLAY.mintIsActive();

    // if (!mintIsActive) {
    //     await _TOKENPLAY.flipMintState();
    // }

    let accounts = await web3.eth.getAccounts();
    //console.log(accounts);
 
    let priceNFT = web3.utils.toBN("1000000000000000000");
    //console.log(priceNFT);

    await _TOKENPLAY.addNFT(10005,priceNFT,accounts[3],5,15,0, {from: accounts[0]});

    await _TOKENPLAY.purchaseNFT(10005, {from: accounts[4], value: 2000000000000000000 });

    console.log(await _TOKENPLAY.totalSupply(10005));

    // await _TOKENPLAY.flipMintState();

    callback();
}