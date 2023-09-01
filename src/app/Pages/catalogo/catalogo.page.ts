import { Component, OnInit } from '@angular/core';
import { ListResponse } from 'src/app/models/api.model';
import { Game } from 'src/app/models/games.model';
import { Gender } from 'src/app/models/gender.model';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { GamesService } from 'src/app/services/games.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
})
export class CatalogoPage implements OnInit {
  loading: boolean = false;
  gamesInProperty: TokenPlayUriGames[] = []
  allGames: TokenPlayGame[] = [];
  constructor(private tokeplayService: TokenplayService) { }

  async ngOnInit() {
    this.allGames = await this.tokeplayService.getNFTs();
    for (const item of this.allGames){
      console.log(item.tokenId);
      
      const gameURI = Object.assign(await this.tokeplayService.fetchGameURI(item.tokenId), item);
      this.gamesInProperty.push(gameURI)
    }
    this.tokeplayService.waitingTx$.subscribe(witingTx => {
      this.loading = witingTx;      
    });
  }
}
