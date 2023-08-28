import { Component, OnInit } from '@angular/core';
import { Game } from 'src/app/models/games.model';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss'],
})
export class GamesComponent  implements OnInit {

  gamesInProperty: any [] = []

  constructor(private tokeplayService: TokenplayService) { }

  async ngOnInit() {
    const allGames = await this.tokeplayService.getNFTs();
    console.log(allGames);
  }

}
