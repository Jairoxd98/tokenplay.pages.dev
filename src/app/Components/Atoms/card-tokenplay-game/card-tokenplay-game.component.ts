import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ethers } from 'ethers';
import { Game } from 'src/app/models/games.model';
import { TokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';
import { TokenplayService } from 'src/app/services/tokenplay.service';

@Component({
  selector: 'app-tokenplay-card-game',
  templateUrl: './card-tokenplay-game.component.html',
  styleUrls: ['./card-tokenplay-game.component.scss'],
})
export class CardTokenplayGameComponent  implements OnInit {
  @Input() game: TokenPlayUriGames = {
    category: '',
    description: '',
    download: '',
    image: '',
    name: '',
    price: 0,
    tokenId: 0
  };
  @Input() buttonType: 'buy' | 'play' = "buy";
  @Input() canSellItem: boolean = false;
  @Output() sellGame = new EventEmitter<TokenPlayUriGames>();
  isAddingGame: boolean = false;

  constructor(private tokenplayService:TokenplayService ) { }

  ngOnInit() {}

  async buyGame(tokenId:number, price: number){
      await this.tokenplayService.buyGame(tokenId, price)
  }

  parseWeiToEth(valueInWei: number){
    return this.tokenplayService.formatWeiToEth(valueInWei);
  }

  emitSellGame(game: TokenPlayUriGames){
    this.sellGame.emit(game);
  }

  balanceOf(address: string, tokenId: number){
    this.tokenplayService.balanceOf(address,tokenId);
  }

}
