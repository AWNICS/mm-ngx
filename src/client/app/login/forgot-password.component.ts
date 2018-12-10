import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Subject } from 'rxjs/Subject';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-forgot-password',
    templateUrl: 'forgot-password.component.html',
    styleUrls: ['login.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

    message: string;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('msg') msg: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(private loginService: LoginService) {}

    ngOnInit(): void {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    resetPassword(email: string) {
        this.loginService.checkUser(email)
        .takeUntil(this.unsubscribeObservables)
        .subscribe((res) => {
            this.message = res.message;
            this.msg.nativeElement.style.display = 'block';
        });
    }
}
