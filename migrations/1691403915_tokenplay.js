const TOKENPLAY = artifacts.require("TOKENPLAY");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(TOKENPLAY,'https://ipfs.io/ipfs/QmYDQMUDQjYSf5KKEuD6fZurTLPF8RpRJ7sLdwK1iUqsNq/'); 
};
