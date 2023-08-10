import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  private loggedInSubs: Subscription;
  isLoggedIn : boolean = false;
  address : any;

  constructor(private authService: AuthService) {
    this.address = localStorage.getItem('address');

    this.loggedInSubs = this.authService.isUserLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

  }

  ngOnInit() {
  }

  getAddress(){
    return this.authService.address;
  }

  logout(){
    this.authService.logOut();
  }

}
