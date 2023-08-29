import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { TokenPlayUriGames } from '../models/tokenplayUriGames.model';

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

  // Método para obtener el URI de un juego
  private async getGameURI(tokenId: number): Promise<string> {
    return await this.contract.methods.uri(tokenId).call();
  }
  
  // Método para obtener los metadatas de un juego
  private async getMetadata(url: string): Promise<TokenPlayUriGames> {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  async fetchGameURI(tokenId: number) {
      const gameURI = await this.getGameURI(tokenId);
      const metadata = await this.getMetadata(gameURI);
      return metadata
  }

  async getBalanceFromAddress(address: any){
    const  weis = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(weis,'ether');
  }

  formatWeiToEth(valueInWei: any){
    return this.web3.utils.fromWei(valueInWei,'ether');
  }

}

