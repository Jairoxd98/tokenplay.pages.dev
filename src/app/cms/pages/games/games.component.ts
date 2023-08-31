import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Game } from 'src/app/models/games.model';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent  implements OnInit {
  isAddingGame: boolean = false;
  gamesInProperty: TokenPlayUriGames[] = []
  allGames: TokenPlayGame[] = [];
  sellingGame: TokenPlayUriGames = {
    category: '',
    descripttion: '',
    download: '',
    image: '',
    name: '',
    price: 0,
    tokenId: 0
  };
  
  nameForm: string = '';
  priceForm: number | null = null;
  private truffleWalletTestAddress: string = '0xBbA1c92C366146e0774aeDc4DC182Bc8DdD5f215';


  constructor(private tokeplayService: TokenplayService, private marketplaceTokenplayService: MarketplaceTokenplayService,private router: Router,  private toastController: ToastController) { }

  async ngOnInit() {
    // await this.getGames()
    
}

async ionViewWillEnter() {
  await this.getGames();
  console.log("GAMES INIT");

}

  showFormSellingGame($event: TokenPlayUriGames) {
    this.sellingGame = $event;  
    this.nameForm = this.sellingGame.name;
  }

  goBackToGames(){
    this.sellingGame.tokenId = 0;
  }

  async getGames(){
    this.gamesInProperty = [];
    const gamesObj = await this.tokeplayService.getGamesFromAddress()

    for (const key in gamesObj) {
        if (gamesObj.hasOwnProperty(key)) {
            const gameObj = gamesObj[key];
            const balanceOfGame = await this.tokeplayService.balanceOf(this.truffleWalletTestAddress, gameObj.game?.tokenId);
            let gameURI = Object.assign(await this.tokeplayService.fetchGameURI(gameObj.game?.tokenId), gameObj.game);
            gameURI = Object.assign(gameURI, {supply: balanceOfGame})
            this.gamesInProperty.push(gameURI)
        }
    }

    console.log(this.gamesInProperty);
  }

  async putGameOnSale(){
    if (this.nameForm && this.priceForm) {

      await this.marketplaceTokenplayService.approveMarketplace();
      await this.marketplaceTokenplayService.sellNFTGame(this.sellingGame.tokenId, this.priceForm)
      await this.ionViewWillEnter();

      this.sellingGame = {
        category: '',
        descripttion: '',
        download: '',
        image: '',
        name: '',
        price: 0,
        tokenId: 0
      };

      const toast = await this.toastController.create({
        message: `Game put on sale`,
        duration: 5000,
        position: 'bottom',
        color: 'success',
        cssClass: 'toastClass'
      });
      await toast.present();
      this.router.navigate(['/cms/selling-games']);
    }else{
      const toast = await this.toastController.create({
        message: `Error: Some Field is empty`,
        duration: 5000,
        position: 'bottom',
        color: 'danger',
        cssClass: 'toastClass'
      });
      await toast.present();
    }
  }

}

