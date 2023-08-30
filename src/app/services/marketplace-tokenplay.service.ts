import {Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');
const MARKETPLACE = require('../../../build/contracts/NFTGamesMarketplace.json');

@Injectable({
  providedIn: 'root'
})
export class MarketplaceTokenplayService {
  web3: any;
  tokenplayContract: any;
  marketPlaceContract: any;
  tokenplayAddress: any;
  marketPlaceAddress: any;
  //address : any;

  constructor() {
    this.web3 = new Web3;

    this.web3.setProvider(
      new this.web3.providers.HttpProvider(environment.provider)
    );
    
    this.tokenplayAddress = TOKENPLAY.networks[environment.networkId].address;
    this.tokenplayContract = new this.web3.eth.Contract(TOKENPLAY.abi, this.tokenplayAddress);

    this.marketPlaceAddress = MARKETPLACE.networks[environment.networkId].address ;
    this.marketPlaceContract = new this.web3.eth.Contract(MARKETPLACE.abi, this.marketPlaceAddress);
  }

  async getGamesOnSale(){
    return await this.marketPlaceContract.methods.getGamesForSale().call();
  }

  createSale(){

  }

  buyNFTGame(){
    
  }

  sellNFTGame(){

  }
}
