import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/games.model';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent  implements OnInit {

  gamesInProperty: TokenPlayUriGames[] = []
  allGames: TokenPlayGame[] = [];
  constructor(private tokeplayService: TokenplayService) { }

  async ngOnInit() {
    this.allGames = await this.tokeplayService.getNFTs();
    for (const item of this.allGames){
      if (item.tokenId > 11000) continue;
      const gameURI = await this.tokeplayService.fetchGameURI(item.tokenId);
      this.gamesInProperty.push(gameURI)
    }
    console.log(this.allGames);
    console.log(this.gamesInProperty);
  }

}
