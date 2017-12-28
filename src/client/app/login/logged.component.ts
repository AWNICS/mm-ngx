import { Component } from '@angular/core';
import { LoginService } from './login.service';
/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  selector: 'mm-logged',
  template: `
  <mm-navbar></mm-navbar>
  <h1> Welcome to mesomeds </h1>
  <p> You are logged in successfully.</p>
  <button type="button" class="btn btn-primary" (click)="logOut();">Log out</button>
  `,
  styles: [`
  h1: {
      margin-top: 80px;
  }
  `]
})
export class LoggedComponent  {

  constructor(
      private loginService: LoginService
  ) { }

  logOut() {
    this.loginService.loggedOut();
  }
 }
