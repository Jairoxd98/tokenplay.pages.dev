import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { TokenplayService } from './tokenplay.service';
import { ethers } from 'ethers';
import { BehaviorSubject } from 'rxjs';

const TOKENPLAY = require('../../../build/contracts/TOKENPLAY.json');
const MARKETPLACE = require('../../../build/contracts/NFTGamesMarketplace.json');

@Injectable({
  providedIn: 'root',
})
export class MarketplaceTokenplayService {
  web3: any;
  tokenplayContract: any;
  marketPlaceContract: any;
  tokenplayAddress: any;
  marketPlaceAddress: any;
  private waitingTx = new BehaviorSubject<boolean>(false);
  waitingTx$ = this.waitingTx.asObservable();

  constructor(
    private authService: AuthService,
    private tokenplayService: TokenplayService
  ) {
    this.web3 = new Web3();

    this.web3.setProvider(
      new this.web3.providers.HttpProvider(environment.provider)
    );

    this.tokenplayAddress = environment.tokenplaySM;
    this.tokenplayContract = new this.web3.eth.Contract(
      TOKENPLAY.abi,
      this.tokenplayAddress
    );

    this.marketPlaceAddress = environment.marketplaceSM;
    this.marketPlaceContract = new this.web3.eth.Contract(
      MARKETPLACE.abi,
      this.marketPlaceAddress
    );
  }

  async getGamesOnSale() {
    return await this.marketPlaceContract.methods.getGamesForSale().call();
  }

  async buyNFTGame(saleId: number, priceGameInWei: number) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await this.authService.getAccount();

      const estimatedGas = await this.marketPlaceContract.methods
        .purchaseFromMarketplace(saleId)
        .estimateGas({
          from: account,
          value: priceGameInWei,
        });

      const data = await this.marketPlaceContract.methods
        .purchaseFromMarketplace(saleId)
        .encodeABI();
      const transactionData = {
        to: this.marketPlaceAddress,
        value: priceGameInWei,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: estimatedGas,
        data: data,
      };

      const pendingTransaction = await signer.sendTransaction(transactionData);
      this.waitingTx.next(true);
      await pendingTransaction.wait();
    } finally {
      this.waitingTx.next(false);
    }
  }

  async sellNFTGame(tokenId: number, priceInWei: number) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();

      const account = await this.authService.getAccount();

      const estimatedGas = await this.marketPlaceContract.methods
        .createSale(tokenId, priceInWei)
        .estimateGas({
          from: account,
        });

      const data = await this.marketPlaceContract.methods
        .createSale(tokenId, priceInWei)
        .encodeABI();
      const transactionData = {
        to: this.marketPlaceAddress,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: estimatedGas,
        data: data,
      };

      const pendingTransaction = await signer.sendTransaction(transactionData);
      this.waitingTx.next(true);
      await pendingTransaction.wait();
    } finally {
      this.waitingTx.next(false);
    }
  }

  async cancelSellGame(saleId: number) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = await provider.getSigner();
      const account = await this.authService.getAccount();

      const estimatedGas = await this.marketPlaceContract.methods
        .cancelSale(saleId)
        .estimateGas({
          from: account,
        });

      const data = await this.marketPlaceContract.methods
        .cancelSale(saleId)
        .encodeABI();
      const transactionData = {
        to: this.marketPlaceAddress,
        gasPrice: this.web3.utils.toHex(10000000000),
        gasLimit: estimatedGas,
        data: data,
      };
      const pendingTransaction = await signer.sendTransaction(transactionData);
      this.waitingTx.next(true);
      await pendingTransaction.wait();
    } finally {
      this.waitingTx.next(false);
    }
  }

  async isApprovedMarketplace() {
    return await this.tokenplayService.isApprovedMarketplace(
      this.marketPlaceAddress
    );
  }

  async approveMarketplace() {
    await this.tokenplayService.approveMarketplace(this.marketPlaceAddress);
  }
}
