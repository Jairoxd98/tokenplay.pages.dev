import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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

  login() {
    // Aquí puedes implementar la lógica de autenticación
    // Por ejemplo, verificar credenciales, hacer una llamada a una API, etc.

    // Simplemente redireccionamos a una página después de iniciar sesión
    this.router.navigate(['/home']);
  }

  async loginMetaMask(){
    let message = "";

    if(this.authService.metamaskInstalled()){
      if(await this.authService.logIn()){
        message = "Signup successfully!";
      }
      else{
        message = "Error ocurred while connecting to MetaMask";
      }
    }
    else{
      message = "Metamask is not installed";
    }

    const toast = await this.toastController.create({
      message: message,
      duration: 2000, // Duración en milisegundos
      position: 'bottom' // 'top' o 'bottom'
    });

    await toast.present();
  }

}
