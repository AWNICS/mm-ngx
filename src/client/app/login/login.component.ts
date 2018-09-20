import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { SocketService } from '../chat/socket.service';
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
  error = '';
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild('email') email: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('eye') eye: ElementRef;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private securityService: SecurityService,
    private sharedService: SharedService,
    private socketService: SocketService
  ) {
  }

  ngOnInit(): void {
    this.navbarComponent.navbarColor(0, '#6960FF');
  }

  login(email: string, password: string) {
    // disables the fields so the user cannot enter anything else until server responds
    this.email.nativeElement.disabled = true;
    this.password.nativeElement.disabled = true;
    this.loginService.login(email, password)
      .subscribe(res => {
        this.email.nativeElement.value = '';
        this.password.nativeElement.value = '';
        this.securityService.setLoginStatus(true);
        this.securityService.setCookie('userDetails', JSON.stringify(res.user), 1);
        this.securityService.setCookie('token', res.token, 1);
        this.socketService.connection(res.user.id);
        if (res.user.role === 'patient') {
          this.router.navigate([`/doctors`]);
        } else if (res.user.role === 'doctor') {
          this.sharedService.updateStatus('online', res.user.id)
            .subscribe(res => {
              return;
            });
          this.router.navigate([`/dashboards/doctors/${res.user.id}`]);
        } else {
          this.router.navigate([`/chat/${res.user.id}`]);
        }
      }, err => {
        this.error = (JSON.parse(err._body)).message;
        this.email.nativeElement.disabled = false;
        this.password.nativeElement.disabled = false;
      });
  }

  showPassword() {
    if(this.password.nativeElement.type === 'password') {
      this.password.nativeElement.type = 'text';
      this.eye.nativeElement.classList.remove('fa-eye');
      this.eye.nativeElement.classList.add('fa-eye-slash');
    } else {
      this.password.nativeElement.type = 'password';
      this.eye.nativeElement.classList.remove('fa-eye-slash');
      this.eye.nativeElement.classList.add('fa-eye');
    }
  }
}
