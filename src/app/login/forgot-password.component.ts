import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-forgot-password',
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
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    resetPassword(email: string) {
        this.loginService.checkUser(email)
        .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((res: any) => {
            this.message = res.message;
            this.msg.nativeElement.style.display = 'block';
        });
    }
}
