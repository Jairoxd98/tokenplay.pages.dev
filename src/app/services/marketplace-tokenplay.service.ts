import {Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');
const MARKETPLACE = require('../../../build/contracts/NFTGamesMarketplace.json');

@Injectable({
  providedIn: 'root'
})
export class MarketplaceTokenplayService {
  private truffleWalletTestAddress: string = '0xBbA1c92C366146e0774aeDc4DC182Bc8DdD5f215';
  web3: any;
  tokenplayContract: any;
  marketPlaceContract: any;
  tokenplayAddress: any;
  marketPlaceAddress: any;
  //address : any;

  constructor(private authService: AuthService) {
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

  async buyNFTGame(saleId: number, priceGameInWei: number){
    const account = await this.authService.getAccount();

    const estimatedGas = await this.marketPlaceContract.methods.purchaseFromMarketplace(saleId).estimateGas({
      from: this.truffleWalletTestAddress,
      value: priceGameInWei
  });

    const data = await this.marketPlaceContract.methods.purchaseFromMarketplace(saleId).encodeABI();
    const transactionData = {
        from: this.truffleWalletTestAddress,
        to: this.tokenplayAddress,
        value: priceGameInWei,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: this.web3.utils.toHex(estimatedGas),
        data: data
    };

    console.log("SaleId: " + saleId);
    console.log("priceGameInWei: " + priceGameInWei);
    

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

  async sellNFTGame(tokenId:number, priceInWei: number){
    const account = await this.authService.getAccount();

    const estimatedGas = await this.marketPlaceContract.methods.createSale(tokenId).estimateGas({
      from: this.truffleWalletTestAddress,
      value: priceInWei
  });

    const data = await this.marketPlaceContract.methods.createSale(tokenId).encodeABI();
    const transactionData = {
        from: this.truffleWalletTestAddress,
        to: this.tokenplayAddress,
        value: priceInWei,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: this.web3.utils.toHex(estimatedGas),
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

  async cancelSellGame(saleId:number){
    const account = await this.authService.getAccount();

    const estimatedGas = await this.marketPlaceContract.methods.cancelSale(saleId).estimateGas({
      from: this.truffleWalletTestAddress,
  });

    const data = await this.marketPlaceContract.methods.cancelSale(saleId).encodeABI();
    const transactionData = {
        from: this.truffleWalletTestAddress,
        to: this.tokenplayAddress,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: this.web3.utils.toHex(estimatedGas),
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
}
