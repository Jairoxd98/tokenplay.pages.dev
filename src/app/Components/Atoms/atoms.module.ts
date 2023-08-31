import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./card/card.component";
import { CategoryCardComponent } from './category-card/category-card.component';
import { IonicModule } from '@ionic/angular';
import { CardTokenplayGameComponent } from './card-tokenplay-game/card-tokenplay-game.component';
import { CardMarketPlaceGameComponent } from './card-marketplace-game/card-marketplace-game.component';


@NgModule({
  declarations: [CardComponent, CategoryCardComponent, CardTokenplayGameComponent, CardMarketPlaceGameComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CardComponent, CategoryCardComponent, CardTokenplayGameComponent, CardMarketPlaceGameComponent]
})
export class AtomsModule { }
