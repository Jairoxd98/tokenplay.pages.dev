import {Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');

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

    //this.addres
  }
}
