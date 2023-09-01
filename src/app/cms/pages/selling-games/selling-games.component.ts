import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketPlaceTokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { AuthService } from 'src/app/services/auth.service';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-selling-games',
  templateUrl: './selling-games.component.html',
  styleUrls: ['./selling-games.component.scss'],
})
export class SellingGamesComponent implements OnInit {
  gamesOnSale: MarketPlaceTokenPlayUriGames[] = [];
  loading: boolean = false;
  constructor(
    private marketplaceTokenplayService: MarketplaceTokenplayService,
    private tokeplayService: TokenplayService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.getSaleGames();
    this.marketplaceTokenplayService.waitingTx$.subscribe((witingTx) => {
      if (this.loading && !witingTx) {
        this.redirectTo()
      }
      this.loading = witingTx;
    });
  }

  async getSaleGames() {
    const gamesWithUri = [];
    const account = await this.authService.getAccount() ?? '';
    const games = await this.marketplaceTokenplayService.getGamesOnSale();
    for (const key in games) {
      if (games.hasOwnProperty(key)) {
          const gameObj = games[key];
          const balanceOfGame = await this.tokeplayService.balanceOf(account, gameObj.tokenId);
          let gameURI = Object.assign(await this.tokeplayService.fetchGameURI(gameObj.tokenId), gameObj);
          gameURI = Object.assign(gameURI, {supply: balanceOfGame})
          gamesWithUri.push(gameURI);
      }
  }    
    this.gamesOnSale = gamesWithUri.filter((x: any) => x.seller === account);
  }

  redirectTo() {
    console.log('Redirect');
      this.router.navigate(['/cms/games']);
  }
}
