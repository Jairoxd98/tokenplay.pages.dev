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
    const gamesObj = await this.tokeplayService.getGamesFromAddress()

    for (const key in gamesObj) {
        if (gamesObj.hasOwnProperty(key)) {
            const gameObj = gamesObj[key];
            const gameURI = Object.assign(await this.tokeplayService.fetchGameURI(gameObj.game?.tokenId), gameObj.game);
            this.gamesInProperty.push(gameURI)
        }
    }

    console.log(this.gamesInProperty);
}


}

