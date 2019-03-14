import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { ChatService } from '../chat/chat.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * This class represents the lazy loaded ResetPasswordComponent.
 */
@Component({
    selector: 'app-reset-password',
    templateUrl: 'reset-password.component.html',
    styleUrls: ['login.component.css'],
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

    message = '';
    token: string;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('msg') msg: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(private loginService: LoginService, private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token');
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    validatePassword(password: string, confirmPassword: string) {
        if (password !== confirmPassword) {
            this.message = 'Passwords do not match';
            this.msg.nativeElement.style.display = 'block';
        } else {
            this.message = '';
            this.msg.nativeElement.style.display = 'none';
        }
    }

    updatePassword(password: string, confirmPassword: string) {
        if (password === '' || confirmPassword === '') {
            this.message = 'All fields are mandatory';
            this.msg.nativeElement.style.display = 'block';
            return;
        } else {
            this.loginService.resetPassword(password, this.token)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                this.message = res.message;
                this.msg.nativeElement.style.display = 'block';
            });
        }
    }
}
