import { Component, OnInit } from '@angular/core';
import { ListResponse } from 'src/app/models/api.model';
import { Game } from 'src/app/models/games.model';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
})
export class MarketplaceComponent  implements OnInit {

  pageNumber: number = 1;
  allGames: ListResponse<Game> = {count: 0, results: []};

  constructor(private gamesService:GamesService) { }

  ngOnInit() {
    this.gamesService.getGames().subscribe((data) => {
      this.allGames = data;
    })
  }

  seeMoreGames(){
    this.pageNumber++;
    this.gamesService.getGames(this.pageNumber).subscribe((data) => {
      this.allGames = {
        count: this.allGames.count + data.count,
        results: [...this.allGames.results, ...data.results]
      }
    })
  }

}
