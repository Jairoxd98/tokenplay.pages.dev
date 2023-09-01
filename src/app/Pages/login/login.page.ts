import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';
import { TokenplayService } from 'src/app/services/tokenplay.service';
import { MarketplaceTokenplayService } from 'src/app/services/marketplace-tokenplay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController, private marketplaceTokenplayService: MarketplaceTokenplayService) {}

  ngOnInit() {
  }

  async login() {
    this.router.navigate(['/home']);

    const toast = await this.toastController.create({
      message: `Metamask Conected`,
      duration: 5000,
      position: 'bottom',
      color: 'success',
      cssClass: 'toastClass'
    });
    await toast.present();
  }

  async loginWithMetamask() {
    try {

      await this.authService.connect();
      const isApprovedMarketplace = await this.marketplaceTokenplayService.isApprovedMarketplace();
      
      if (!isApprovedMarketplace) {
        await this.marketplaceTokenplayService.approveMarketplace();
      }
      
      console.log("LOGIN");
      await this.login();
      console.log("LOGIN 2");
    } catch (error) {
      console.error("Error en loginWithMetamask:", error);
    }
  
  }

}
