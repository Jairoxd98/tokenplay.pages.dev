import { Component, OnInit } from '@angular/core';
import { MarketPlaceTokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent  implements OnInit {

  gamesInMarketPlace: MarketPlaceTokenPlayUriGames[] = []
  constructor(private marketplaceService: MarketplaceTokenplayService, private tokenplayService: TokenplayService) { }

  async ngOnInit() {    
   const games = await this.marketplaceService.getGamesOnSale();

   for (const game of games){
    const gameURI = Object.assign(await this.tokenplayService.fetchGameURI(game.tokenId), game);
    this.gamesInMarketPlace.push(gameURI)
  }
  }
}
