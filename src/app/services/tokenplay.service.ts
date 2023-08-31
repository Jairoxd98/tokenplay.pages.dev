import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import Web3 from 'web3';
import { TokenPlayUriGames } from '../models/tokenplayUriGames.model';
import { AuthService } from './auth.service';
import { ethers } from 'ethers';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');
@Injectable({
  providedIn: 'root'
})
export class TokenplayService {
  web3: any;
  contract: any;
  tokenplayAddress: any;

  constructor(private authService: AuthService) {
    this.web3 = new Web3;

    this.web3 = new Web3(window.ethereum);

    this.tokenplayAddress = environment.tokenplaySM;
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
      console.log(gameURI);
      
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
    const provider = new ethers.BrowserProvider(window.ethereum);
		const signer = await provider.getSigner();

    const account = await this.authService.getAccount();

    const data = await this.contract.methods.purchaseNFT(tokenId).encodeABI();
    const transactionData = {
        from: account,
        to: this.tokenplayAddress,
        value: priceGameInWei,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: this.web3.utils.toHex(1000000),
        data: data
    };

    const pendingTransaction = await signer.sendTransaction(transactionData);
    const confirmedTransaction = await pendingTransaction.wait();
  }

  // Método para obtener los juegos comprados por un usuario
  async getGamesFromAddress(){
    const account = await this.authService.getAccount();
    return await this.contract.methods.getPurchasedNFTs(account).call();
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

  async approveMarketplace(addresMarketplace: string){
    const account = await this.authService.getAccount();
    await this.contract.methods.approveMarketplace(addresMarketplace).send({ from: account });
  }
  
  async balanceOf(address: string, tokenId: number){
    return await this.contract.methods.balanceOf(address, tokenId).call();
  }

}

