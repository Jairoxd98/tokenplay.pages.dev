import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./card/card.component";
import { CategoryCardComponent } from './category-card/category-card.component';
import { IonicModule } from '@ionic/angular';
import { CardTokenplayGameComponent } from './card-tokenplay-game/card-tokenplay-game.component';


@NgModule({
  declarations: [CardComponent, CategoryCardComponent, CardTokenplayGameComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CardComponent, CategoryCardComponent, CardTokenplayGameComponent]
})
export class AtomsModule { }
