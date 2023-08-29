import {Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';

var TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');

@Injectable({
  providedIn: 'root'
})
export class NodeService {
  web3: any;
  contract: any;
  tokenplayAddress: any;
  address : any;
  /*
  wallet:any = {
    address: ""
  };
  */
  games: any = [];

  constructor() {
    this.web3 = new Web3;

    this.web3.setProvider(
      new this.web3.providers.HttpProvider(environment.provider)
    );

    //let accounts = this.web3.eth.getAccounts();
    //this.wallet.addressUser = accounts[1];
    

    this.tokenplayAddress = TOKENPLAY.networks[environment.networkId].address;
    this.contract = new this.web3.eth.Contract(TOKENPLAY.abi, this.tokenplayAddress);

  }

  // Método para obtener todos los NFTs disponibles
  async getNFTs(): Promise<any> {
    return await this.contract.methods.getNFTs().call();
  }

  // Método para obtener el URI de un juego
  async getGameURI(tokenId: number): Promise<string> {
    return await this.contract.methods.uri(tokenId).call();
  }

  // Método para obtener los metadatas de un juego
  async getMetadata(url: string): Promise<any> {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  }

  // Método para obtener el balance de una cuenta
  async getBalance(address: any){
    var weis = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(weis,'ether');
  }

  // Metodo para obtener todos los juegos comprados
  async getGames() : Promise<any[]> {
    await this.contract.getPastEvents('Purchased',{fromBlock: 0, toBlock: 'latest'}).then(async(events:any) =>{
        for (let event of events) {
            var request = await this.contract.methods.uri(event.returnValues.tokenId).call(); //URI
            var response = await fetch(request);
            var game = await response.json;
            console.log(event);
            console.log(request);
            console.log(response);
            console.log(game);
            //game.tokenId = event.returnValues.tokenId; //.minter

            this.games.push(game);
        }
        console.log(this.games);
    });
    return this.games;
  }

  
  /*
  async sendIcoTokens(sendData:any) {
    

    var rawData = {
      from: this.wallet.address,
      to: this.icoContractAddress,
      value: 0,
      gasPrice: this.web3.utils.toHex(10000000000),
      gasLimit: this.web3.utils.toHex(1000000),
      nonce: await this.web3.eth.getTransactionCount(this.wallet.address),
      data: this.icoContract.methods.transfer(sendData.address, sendData.amount).encodeABI()
    };

    var signed = await this.web3.eth.accounts.signTransaction(rawData, this.wallet.privateKey.toString('hex'));

    this.web3.eth.sendSignedTransaction(signed.rawTransaction).then(
      (receipt: any) => {
        console.log(receipt)
      },
      (error: any) => {
        console.log(error)
      }
    );
  }
  */
}