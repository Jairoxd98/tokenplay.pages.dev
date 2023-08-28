import { Component, OnInit } from '@angular/core';
import { ListResponse } from 'src/app/models/api.model';
import { Game } from 'src/app/models/games.model';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-category-games',
  templateUrl: './category-games.component.html',
  styleUrls: ['./category-games.component.scss'],
})
export class CategoryGamesComponent  implements OnInit {

  pageNumber: number = 1;
  ordering: string = '-metacritic'
  allGames: ListResponse<Game> = {count: 0, results: []};

  constructor(private gamesService:GamesService) { }

  ngOnInit() {
    this.gamesService.getGames().subscribe((data) => {
      this.allGames = data;
    })
  }

  seeMoreGames(){
    this.pageNumber++;
    this.gamesService.getGames(this.pageNumber, this.ordering).subscribe((data) => {
      this.allGames = {
        count: this.allGames.count + data.count,
        results: [...this.allGames.results, ...data.results]
      }
    })
  }

  seeGamesFilter(ordering: string){
    this.ordering = ordering
    this.gamesService.getGames(this.pageNumber, ordering).subscribe((data) => {
      this.allGames = data;
    })
  }

}
