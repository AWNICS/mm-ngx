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
    this.navbarComponent.navbarColor(0, '#6960FF');
  }

  login(email: string, password: string) {
    this.loginService.login(email, password)
    .subscribe(res => {
      if(!res) { this.error = 'Email ID or password incorrect';
    } else {
      this.securityService.setLoginStatus(true);
      this.securityService.setCookie('userDetails', JSON.stringify(res.user), 1);
      this.securityService.setCookie('token', res.token, 1);
      this.router.navigate([`/chat/${res.user.id}`]);
    }
    });
  }
}
