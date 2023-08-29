import { Component, Input, OnInit } from '@angular/core';
import { Game } from 'src/app/models/games.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { TokenplayService } from 'src/app/services/tokenplay.service';

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
    name: '',
    price: 0,
    tokenId: 0
  };
  @Input() buttonType: 'buy' | 'play' = "buy";

  constructor(private tokenplayService:TokenplayService ) { }

  ngOnInit() {}

  buyGame(tokenId:number, price: number){
    this.tokenplayService.buyGame(tokenId, price)
  }

  parseWeiToEth(valueInWei: number){
    return this.tokenplayService.formatWeiToEth(valueInWei);
  }

}
