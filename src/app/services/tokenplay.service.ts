import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { TokenPlayUriGames } from '../models/tokenplayUriGames.model';
import { AuthService } from './auth.service';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');
@Injectable({
  providedIn: 'root'
})
export class TokenplayService {

  private truffleWalletTestAddress: string = '0x7Ba7BAeed0b7562B4cf9e409aD37788BC6ae03d8';
  web3: any;
  contract: any;
  tokenplayAddress: any;

  constructor(private authService: AuthService) {
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

  // Método para obtener el balance de un juego
  async getBalanceFromAddress(address: any){
    const  weis = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(weis,'ether');
  }

  // Método para transformar de WEI a ETH
  formatWeiToEth(valueInWei: any){
    return this.web3.utils.fromWei(valueInWei,'ether');
  }

  // Método para comprar un juego
  async buyGame(tokenId: number, priceGameInWei: number) {
    const account = await this.authService.getAccount();

    const data = await this.contract.methods.purchaseNFT(tokenId).encodeABI();
    const transactionData = {
        from: this.truffleWalletTestAddress,
        to: this.tokenplayAddress,
        value: priceGameInWei,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: this.web3.utils.toHex(1000000),
        data: data
    };

    this.web3.eth.sendTransaction(transactionData)
        .on('transactionHash', function(hash: any){
            console.log(`Transaction hash: ${hash}`);
        })
        .on('receipt', function(receipt: any){
            console.log(`Transaction was confirmed in block: ${receipt.blockNumber}`);
        })
        .on('error', function(error: any, receipt: any) {
            console.error('Error sending transaction', error);
        });
  }

  // Método para obtener los juegos comprados por un usuario
  async getGamesFromAddress(address: string = this.truffleWalletTestAddress){
    return await this.contract.methods.getPurchasedNFTs(address).call();
  }

  // Método para comprobar que el usuario es el Owner
  async checkOwnership() {
    const userAddress = await this.authService.getAccount();
    const ownerAddress = await this.contract.methods.owner().call();
    return userAddress === ownerAddress;
  }

  // Método para cambiar el estado de Mint
  async flipMintState(): Promise<any> {
    const userAddress = await this.authService.getAccount();
    const isOwner = await this.checkOwnership();
    if (!isOwner) {
      alert('You are not the owner of this contract.');
      return;
    }
    return await this.contract.methods.flipMintState().send({ from: userAddress });
  }

}

