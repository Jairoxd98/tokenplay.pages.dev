const TOKENPLAY = artifacts.require("TOKENPLAY");

module.exports = function(_deployer) {
  // Use deployer to state migration tasks.
  _deployer.deploy(TOKENPLAY,'https://ipfs.io/ipfs/QmaCGRMaT7FFsJzXQ1bmVvwBsXhTNAW5APrhDh67AGXLoz/'); 
};
