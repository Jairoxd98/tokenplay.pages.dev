import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from "./card/card.component";
import { CategoryCardComponent } from './category-card/category-card.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [CardComponent, CategoryCardComponent],
  imports: [
    CommonModule,
    IonicModule,
  ],
  exports: [CardComponent, CategoryCardComponent]
})
export class AtomsModule { }
