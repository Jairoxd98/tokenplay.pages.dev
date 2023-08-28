import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomePage } from './home/home.page';
import { LoginPage } from './login/login.page';
import { RegisterPageComponent } from './register/register.page';
import { MoleculesModule } from '../Components/Molecules/molecules.module';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { CategoryGamesComponent } from './category-games/category-games.component';




@NgModule({
  declarations: [HomePage,LoginPage,RegisterPageComponent, MarketplaceComponent, CategoryGamesComponent],
  imports: [
    CommonModule,
    MoleculesModule,
    IonicModule,
    FormsModule,
    RouterModule,
  ],
  exports: [HomePage,LoginPage,RegisterPageComponent, MarketplaceComponent, CategoryGamesComponent],
})
export class PagesModule { }
