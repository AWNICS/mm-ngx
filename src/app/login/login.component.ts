import { Component, ViewChild, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { SocketService } from '../chat/socket.service';
import { ProfileService } from '../profile/profile.service';
import { ChatService } from '../chat/chat.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * This class represents the lazy loaded LoginComponent.
 */
@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {

  user: UserDetails;
  error = '';
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild('email') email: ElementRef;
  @ViewChild('loginButton') loginButton: ElementRef;
  @ViewChild('password') password: ElementRef;
  @ViewChild('eye') eye: ElementRef;
  form: FormGroup = this.fb.group({
    email: [],
    password: []
  })
  private unsubscribeObservables = new Subject();

  constructor(
    private loginService: LoginService,
    private router: Router,
    private securityService: SecurityService,
    private sharedService: SharedService,
    private socketService: SocketService,
    private chatService: ChatService,
    private profileService: ProfileService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    // this.navbarComponent.navbarColor(0, '#6960FF');
  }

  ngOnDestroy() {
    this.unsubscribeObservables.next();
    this.unsubscribeObservables.complete();
  }

  login(email: string, password: string) {
    // disables the fields so the user cannot enter anything else until server responds
    this.sharedService.toggleElements([this.email, this.password, this.loginButton]);
    this.loginService.login(email, password)
      .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe(res => {
        this.email.nativeElement.value = '';
        this.password.nativeElement.value = '';
        this.securityService.setLoginStatus(true);
        this.securityService.setCookie('userDetails', JSON.stringify(res.user), 1);
        this.securityService.setCookie('token', res.token, 1);
        this.sharedService.setToken();
        this.chatService.setToken();
        this.profileService.setToken();
        this.socketService.connection(res.user.id);
        if (res.user.role === 'patient') {
          this.router.navigate(['/']);
        } else if (res.user.role === 'doctor') {
          this.sharedService.updateStatus('online', res.user.id)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res1 => {
              return;
            });
          this.router.navigate([`/dashboards/doctors/${res.user.id}`]);
        } else if (res.user.role === 'admin') {
          this.router.navigate([`/admin/${res.user.id}`]);
        } else {
          this.router.navigate([`/chat/${res.user.id}`]);
        }
      }, err => {
        console.log(err);
        this.error = err.message;
        this.sharedService.toggleElements([this.email, this.password, this.loginButton]);
        setTimeout(() => {
          this.error = '';
        }, 8000);
      });
  }

  showPassword() {
    if (this.password.nativeElement.type === 'password') {
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
