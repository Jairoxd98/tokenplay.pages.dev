import { Component, OnInit } from '@angular/core';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent  implements OnInit {

  gamesInProperty: TokenPlayUriGames[] = []
  allGames: TokenPlayGame[] = [];
  constructor(private marketplaceService: MarketplaceTokenplayService) { }

  async ngOnInit() {
    const pp = await this.marketplaceService.getGamesOnSale();
    console.log(pp);
    
  }
}
