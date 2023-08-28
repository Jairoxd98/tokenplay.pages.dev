import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsRoutingModule } from './cms-routing.module';
import { GamesComponent } from "./pages/games/games.component";
import { LayoutComponent } from "./pages/layout/layout.component";
import { SellingGamesComponent } from "./pages/selling-games/selling-games.component";
import { IonicModule } from '@ionic/angular';
import { AtomsModule } from '../Components/Atoms/atoms.module';
import { MoleculesModule } from '../Components/Molecules/molecules.module';


@NgModule({
  declarations: [GamesComponent,LayoutComponent,SellingGamesComponent],
  imports: [
    CommonModule,
    CmsRoutingModule,
    IonicModule,
    AtomsModule,
    MoleculesModule
  ]
})
export class CmsModule { }
