import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private window: any;
  address : any;
  cuttedAddress: any;

  private isUserLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isUserLoggedIn$ = this.isUserLoggedInSubject.asObservable();

  constructor(@Inject(DOCUMENT) private document: Document){
    this.window = document.defaultView;
    this.address = localStorage.getItem('address');
  }

  isMetamaskReady(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const checkMetamask = () => {
        if (this.window.ethereum != null && this.window.ethereum._state.accounts != null) {
          resolve(true);
        }
        else if(this.window.ethereum == undefined){
          resolve(false);
        }
        else
        {
          setTimeout(checkMetamask, 300);
        }
      };

      checkMetamask();
    });
  }

  async isLoggedIn(){
    const isReady = await this.isMetamaskReady();
    if(isReady && this.window.ethereum != null && this.window.ethereum._state.accounts != null &&
      this.window.ethereum._state.accounts.find((elem: string) => elem == this.address) != undefined)
    {
      this.isUserLoggedInSubject.next(true);
    }
    else{
      this.isUserLoggedInSubject.next(false);
    }
  }

  metamaskInstalled(){
    return this.window.ethereum != null;
  }

  async logIn() {
    try{
      let resultLogin = await this.requestLogin();
      this.isUserLoggedInSubject.next(resultLogin);
      return true;
    }
    catch(ex){
      this.isUserLoggedInSubject.next(false);
      return false;
    }
  }

  private async requestLogin(){
    return new Promise<boolean>((resolve) => {
      try
      {
        this.window.ethereum.request({method: 'eth_requestAccounts'})
        .then((accounts:any) => {
          this.address = accounts[0];
          localStorage.setItem('address', this.address);
          resolve(true);
        })
        .catch(() => {
          resolve(false);
        });
      }
      catch(ex){
        resolve(false);
      }
    });
  }

  async logOut() {
    try{
      let resultLogout = await this.resquestLogout();
      this.isUserLoggedInSubject.next(!resultLogout);
      return true;
    }
    catch(ex){
      this.isUserLoggedInSubject.next(false);
      return false;
    }
  }

  private async resquestLogout (){
    return new Promise<boolean>((resolve) => {
      if (this.window.ethereum) {
        try {

          this.window.ethereum.request({
            method: "eth_requestAccounts",
            params: [
              {
                eth_accounts: {}
              }
            ]
          });

          localStorage.removeItem('address');

          resolve(true);
        } catch (error) {
          resolve(false);
        }
      }
    });
  }
}

