import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  email: string = '';
  password: string = '';
  retypePassword: string = '';

  constructor(private router: Router) {}

  ngOnInit() {
  }

  register() {
    // Aquí puedes implementar la lógica de autenticación
    // Por ejemplo, verificar credenciales, hacer una llamada a una API, etc.

    // Simplemente redireccionamos a una página después de iniciar sesión
    this.router.navigate(['/home']);
  }

}
