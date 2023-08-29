import { Component, OnInit } from '@angular/core';
import { ListResponse } from 'src/app/models/api.model';
import { Game } from 'src/app/models/games.model';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { GamesService } from 'src/app/services/games.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent  implements OnInit {

  gamesInProperty: TokenPlayUriGames[] = []
  allGames: TokenPlayGame[] = [];
  constructor(private tokeplayService: TokenplayService) { }

  async ngOnInit() {
    this.allGames = await this.tokeplayService.getNFTs();
    for (const item of this.allGames){
      if (item.tokenId > 11000) continue;
      const gameURI = Object.assign(await this.tokeplayService.fetchGameURI(item.tokenId), {price: this.tokeplayService.formatWeiToEth(item.price)});
      this.gamesInProperty.push(gameURI)
    }
    console.log(this.allGames);
    console.log(this.gamesInProperty);
  }
}
