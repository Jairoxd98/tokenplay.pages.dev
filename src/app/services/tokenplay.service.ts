import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');
@Injectable({
  providedIn: 'root'
})
export class TokenplayService {

  web3: any;
  contract: any;
  tokenplayAddress: any;
  address : any;

  constructor() {
    this.web3 = new Web3;

    this.web3.setProvider(
      new this.web3.providers.HttpProvider(environment.provider)
    );

    this.tokenplayAddress = TOKENPLAY.networks[environment.networkId].address;
    this.contract = new this.web3.eth.Contract(TOKENPLAY.abi, this.tokenplayAddress);
  }

  // Método para obtener todos los NFTs disponibles
  async getNFTs(): Promise<any> {
    return await this.contract.methods.getNFTs().call();
  }
}
