import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['login.component.css'],
})
export class ForgotPasswordComponent implements OnInit {

    message: string;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('msg') msg: ElementRef;

    constructor(private loginService: LoginService) {}

    ngOnInit(): void {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    resetPassword(email: string) {
        this.loginService.checkUser(email)
        .subscribe((res) => {
            this.message = res.message;
            this.msg.nativeElement.style.display = 'block';
        });
    }
}
