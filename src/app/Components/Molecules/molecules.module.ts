import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { AtomsModule } from '../Atoms/atoms.module';
import { CardListComponent } from './card-list/card-list.component';
import { CategoryCardListComponent } from './category-card-list/category-card-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtomsModule,
  ],
  declarations: [HeaderComponent, CardListComponent, CategoryCardListComponent],
  exports: [HeaderComponent, CardListComponent, CategoryCardListComponent],
})
export class MoleculesModule {}
