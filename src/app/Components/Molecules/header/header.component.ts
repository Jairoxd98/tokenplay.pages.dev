import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {

  isLoggedIn : boolean = false;

  constructor(private authService: AuthService, private router: Router, private marketplaceTokenplayService: MarketplaceTokenplayService) {}

  ngOnInit() {
    this.authService.loggedIn$.subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout(){
    this.authService.disconnect();
  }

  navegarA(path: string) {
    this.router.navigate([`/${path}`]);
  }

  async goToCms(){
    this.navegarA('cms')
    const isApprovedMarketplace = await this.marketplaceTokenplayService.isApprovedMarketplace();
      
    if (!isApprovedMarketplace) {
      await this.marketplaceTokenplayService.approveMarketplace();
    }
  }

}
