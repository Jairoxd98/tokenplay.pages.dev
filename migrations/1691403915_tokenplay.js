const TOKENPLAY = artifacts.require("TOKENPLAY");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(TOKENPLAY,'https://ipfs.io/ipfs/QmTvCsLN9UVSP6aS4pFfwVd9ivmvbuxNLMBHXcA6AefL3S/'); 
};
