import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./card/card.component";
import { CategoryCardComponent } from './category-card/category-card.component';
import { IonicModule } from '@ionic/angular';
import { CardTokenplayGameComponent } from './card-tokenplay-game/card-tokenplay-game.component';
import { CardMarketPlaceGameComponent } from './card-marketplace-game/card-marketplace-game.component';
import { SpinnerComponent } from './spinner/spinner.component';


@NgModule({
  declarations: [CardComponent, CategoryCardComponent, CardTokenplayGameComponent, CardMarketPlaceGameComponent, SpinnerComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CardComponent, CategoryCardComponent, CardTokenplayGameComponent, CardMarketPlaceGameComponent, SpinnerComponent]
})
export class AtomsModule { }
