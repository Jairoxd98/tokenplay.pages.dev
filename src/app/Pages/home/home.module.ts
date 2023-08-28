import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { MoleculesModule } from 'src/app/Components/Molecules/molecules.module';
import { AtomsModule } from 'src/app/Components/Atoms/atoms.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MoleculesModule,
    AtomsModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
