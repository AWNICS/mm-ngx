import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
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
  loginDetails: FormGroup;

  constructor(
      private fb: FormBuilder,
      private loginService: LoginService
  ) { }

  /**
   * initialising form group
   * @memberOf LoginComponent
   */
  ngOnInit(): void {
      this.loginDetails = this.fb.group({
        username: '',
        password: ''
      });
  }

  login(loginDetails: any) {
    console.log('Log in details: ' + loginDetails);
    this.loginService.loggedIn();
  }
 }
