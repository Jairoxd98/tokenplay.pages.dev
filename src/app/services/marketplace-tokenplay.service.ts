import {Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';

const TOKENPLAY_MARKETPLACE = require('../../../build/contracts/NFTGamesMarketplace.json');

@Injectable({
  providedIn: 'root'
})
export class MarketplaceTokenplayService {
  web3: any;
  contract: any;
  tokenplayAddress: any;
  address : any;

  constructor() {
    this.web3 = new Web3;

    this.web3.setProvider(
      new this.web3.providers.HttpProvider(environment.provider)
    );

    this.tokenplayAddress = TOKENPLAY_MARKETPLACE.networks[environment.networkId].address;
    this.contract = new this.web3.eth.Contract(TOKENPLAY_MARKETPLACE.abi, this.tokenplayAddress);
  }

  buyNFTGame(){

  }

  shellNFTGame(){
    
  }
}
