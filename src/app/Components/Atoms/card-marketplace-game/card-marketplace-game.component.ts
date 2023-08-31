import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Game } from 'src/app/models/games.model';
import { MarketPlaceTokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-marketplace-card-game',
  templateUrl: './card-marketplace-game.component.html',
  styleUrls: ['./card-marketplace-game.component.scss'],
})
export class CardMarketPlaceGameComponent  implements OnInit {
  @Input() game: MarketPlaceTokenPlayUriGames = {
    category: '',
    descripttion: '',
    download: '',
    image: '',
    name: '',
    price: 0,
    tokenId: 0,
    arrayPosition: 0,
    saleId: 0,
    seller: '',
    status: 0
  };
  @Input() buttonType: 'buy' | 'sell' = "buy";

  constructor(private marketplaceService:MarketplaceTokenplayService, private tokenplayService:TokenplayService, private toastController: ToastController) { }

  ngOnInit() {}

  async buyGame(saleId:number, price: number){
    try {
      this.marketplaceService.buyNFTGame(saleId, price)

      const toast = await this.toastController.create({
        message: `Game purchased successfully`,
        duration: 5000,
        position: 'bottom',
        color: 'success',
        cssClass: 'toastClass'
      });
      await toast.present();
    } catch (error) {
      const toast = await this.toastController.create({
        message: `Error`,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
        cssClass: 'toastClass'
      });
      await toast.present();
    }
  }

  parseWeiToEth(valueInWei: number){
    return this.tokenplayService.formatWeiToEth(valueInWei);
  }

  shortenWalletAddress = (address: string, digits = 4) => {
		if (!address) {
			return '';
		}
		return `${address.slice(0, digits + 2)}...${address.slice(-digits)}`;
	};
}
