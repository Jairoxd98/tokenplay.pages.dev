import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root'
})
export class AuthService
{
  private web3!: Web3;

  private loggedIn = new BehaviorSubject<boolean>(false);
  loggedIn$ = this.loggedIn.asObservable();

  constructor(private router: Router) {
    this.init()
  }

  async init() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      window.ethereum.on('accountsChanged', (accounts: string | any[]) => {
        if (accounts.length > 0) {
          this.loggedIn.next(true);
        } else {
          // Si esta conectado a la pagina pero el usuario desde metamask la desconecta, automaticamente lo enviamos a la home
          if (this.loggedIn) this.router.navigate(['/home']); 
          this.loggedIn.next(false);
        }
      });
    } 
    else {   
      console.error('MetaMask no detectado!');
    }

    //Cuando arranque la pagina hace un check de si tiene la pagina conectada con metamask para no volver a pedir que la conecte.
    //Le pedimos las wallets si no hay ninguna wallet no esta conectada, si hay aluna wallet si lo esta
    if (await this.getAccount()) {      
      this.loggedIn.next(true);
    }
  }

  async connect(): Promise<void> {
    if (!this.web3) return;

    const accounts = await this.web3.eth.requestAccounts();
    if (accounts && accounts.length > 0) {
      this.loggedIn.next(true);
    }
  }

  async getAccount(): Promise<string | null> {
    if (!this.web3) {
      console.error('Web3 no inicializado');
      return null;
    }

    const accounts = await this.web3.eth.getAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  }

  disconnect(): void {
    if (window.ethereum && window.ethereum.isConnected()) {
      // Por ahora, MetaMask no tiene una manera nativa de "desconectar". 
      // Pero puedes resetear tu UI o recargar la página si es necesario.
      this.loggedIn.next(false);
    }
  }
}

