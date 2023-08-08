const TOKENPLAY = artifacts.require("TOKENPLAY");

module.exports = async function (callback) {
    var _TOKENPLAY = await TOKENPLAY.deployed();

    var mintIsActive = await _TOKENPLAY.mintIsActive();

    if (!mintIsActive) {
        await _TOKENPLAY.flipMintState();
    }

    await _TOKENPLAY.mint(game1, 10, { value: 10000000000000000 });
    await _TOKENPLAY.mint(game2, 10, { value: 10000000000000000 });

    await _TOKENPLAY.flipMintState();

    callback();
}