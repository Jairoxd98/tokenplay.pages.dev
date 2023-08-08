import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
  }

  login() {
    // Aquí puedes implementar la lógica de autenticación
    // Por ejemplo, verificar credenciales, hacer una llamada a una API, etc.

    // Simplemente redireccionamos a una página después de iniciar sesión
    this.router.navigate(['/home']);
  }

}
