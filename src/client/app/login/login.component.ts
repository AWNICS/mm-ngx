import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent {

  user: UserDetails;
  error: string;

  constructor(
      private loginService: LoginService,
      private router: Router
  ) { }

  login(username: string) {
    this.loginService.getUserByName(username)
    .then(user => {
      this.user = user;
        this.router.navigate([`/chat/${user.id}`]);
    }).catch(e => {
      this.error = 'User not found';
      return;
    });
  }
 }
