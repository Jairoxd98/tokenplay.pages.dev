import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './cms/pages/layout/layout.component';
import { LoginGuard } from './guards/login.guard';
import { CategoryGamesComponent } from './Pages/category-games/category-games.component';
import { HomePage } from './Pages/home/home.page';
import { LoginPage } from './Pages/login/login.page';
import { MarketplaceComponent } from './Pages/marketplace/marketplace.component';
import { RegisterPageComponent } from './Pages/register/register.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePage,
  },
  {
    path: 'login',
    component: LoginPage,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  {
    path: 'marketplace',
    component: MarketplaceComponent,
  },
  {
    path: 'category-games',
    component: CategoryGamesComponent,
  },
  {
    path: 'cms',
    // canActivate: [LoginGuard],
    loadChildren: () => import('./cms/cms.module').then((m) => m.CmsModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
