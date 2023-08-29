import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/games.model';
import { TokenPlayGame } from 'src/app/models/tokenplayGame.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';

@Component({
  selector: 'app-tokenplay-card-game',
  templateUrl: './card-tokenplay-game.component.html',
  styleUrls: ['./card-tokenplay-game.component.scss'],
})
export class CardTokenplayGameComponent  implements OnInit {
  
  @Input() game: TokenPlayUriGames = {
    category: '',
    descripttion: '',
    download: '',
    image: '',
    name: ''
  };

  constructor() { }

  ngOnInit() {}

  buyGame(){
    console.log("Buy Game");
    
  }

}
