import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Game } from 'src/app/models/games.model';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';
import { AuthService } from 'src/app/services/auth.service';


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
    description: '',
    download: '',
    image: '',
    name: '',
    price: 0,
    tokenId: 0
  };
  
  nameForm: string = '';
  priceForm: number | null = null;

  constructor(private tokeplayService: TokenplayService, private marketplaceTokenplayService: MarketplaceTokenplayService,private router: Router,  private toastController: ToastController, private authService: AuthService) { }

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
    const account = await this.authService.getAccount();
    const gamesObj = await this.tokeplayService.getGamesFromAddress()

    if (account !== null) {
    for (const key in gamesObj) {
        if (gamesObj.hasOwnProperty(key)) {
            const gameObj = gamesObj[key];
            const balanceOfGame = await this.tokeplayService.balanceOf(account, gameObj.game?.tokenId);
            let gameURI = Object.assign(await this.tokeplayService.fetchGameURI(gameObj.game?.tokenId), gameObj.game);
            gameURI = Object.assign(gameURI, {supply: balanceOfGame})
            this.gamesInProperty.push(gameURI)
        }
    }

    console.log(this.gamesInProperty);
  } else {
    console.error("Account is null");
  }
  }

  async putGameOnSale(){
    if (this.nameForm && this.priceForm) {

      // await this.marketplaceTokenplayService.approveMarketplace();
      await this.marketplaceTokenplayService.sellNFTGame(this.sellingGame.tokenId, this.priceForm)
      await this.ionViewWillEnter();

      this.sellingGame = {
        category: '',
        description: '',
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

