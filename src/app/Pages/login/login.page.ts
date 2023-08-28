import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router, private authService: AuthService, private toastController: ToastController) {}

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
    await this.authService.connect();
    await this.login();
  }

}
