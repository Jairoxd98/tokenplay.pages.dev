import { Component, OnInit } from '@angular/core';
import { MarketPlaceTokenPlayUriGames } from 'src/app/models/tokenplayUriGames.model';
import { AuthService } from 'src/app/services/auth.service';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';

@Component({
  selector: 'app-selling-games',
  templateUrl: './selling-games.component.html',
  styleUrls: ['./selling-games.component.scss'],
})
export class SellingGamesComponent  implements OnInit {
  private truffleWalletTestAddress: string = '0xBbA1c92C366146e0774aeDc4DC182Bc8DdD5f215';
  gamesOnSale: MarketPlaceTokenPlayUriGames[] = []
  
  constructor(private marketplaceTokenplayService: MarketplaceTokenplayService, private authService: AuthService) { }

  async ngOnInit() {
    await this.getSaleGames();
  }

  async getSaleGames(){
    const account = await this.authService.getAccount();
    const  games = await this.marketplaceTokenplayService.getGamesOnSale();
    this.gamesOnSale = games.filter((x: any) => x.seller === this.truffleWalletTestAddress);
    console.log("Games");
    console.log(games)
    console.log("Filtered");
    console.log(this.gamesOnSale)
  }

}
