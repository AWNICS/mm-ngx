import { Component, OnInit } from '@angular/core';
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
export class LoginComponent implements OnInit {

  private user: UserDetails;
  private error: string;

  constructor(
      private loginService: LoginService,
      private router: Router
  ) { }

  /**
   * initialising form group
   * @memberOf LoginComponent
   */
  ngOnInit(): void {
    console.log('Init');
  }

  login(username: string) {
    this.loginService.getUserByName(username)
    .then(user => {
      this.user = user;
        this.router.navigate(['/chat']);
    }).catch(e => {
      this.error = e.statusText;
      return;
    });
  }
 }
