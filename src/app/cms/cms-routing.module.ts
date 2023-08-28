import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GamesComponent } from "./pages/games/games.component";
import { LayoutComponent } from "./pages/layout/layout.component";
import { SellingGamesComponent } from "./pages/selling-games/selling-games.component";

const routes: Routes = [
  {
    path:'',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'games',
        pathMatch: 'full',
      },
      {
        path: 'games',
        component: GamesComponent
      },
      {
        path: 'selling-games',
        component: SellingGamesComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CmsRoutingModule { }
