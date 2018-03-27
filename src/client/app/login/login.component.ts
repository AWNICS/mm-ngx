import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit {

  user: UserDetails;
  error: string;
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

  constructor(
      private loginService: LoginService,
      private router: Router,
      private securityService: SecurityService
  ) {
   }

  ngOnInit(): void {
    this.navbarComponent.navbarColor(0, '#534FFE');
  }

  login(email: string, password: string) {
    this.loginService.login(email, password)
    .subscribe(res => {
      this.securityService.setLoginStatus(true);
      this.securityService.setCookie(res.user);
      console.log('res ', res);
      if(!res) { this.error = 'Email ID or password incorrect';}
      this.securityService.setToken(res.token);
      this.router.navigate([`/chat/${res.user.id}`]);
    });
  }
 }
