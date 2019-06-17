import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { PasswordValidation } from './password.validator';
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
    validToken: Boolean;
    error: Boolean;
    formSubmitted: Boolean;
    token: string;
    formControls: any;
    @ViewChild('password') password: ElementRef;
    @ViewChild('resetButton') resetButton: ElementRef;
    @ViewChild('eye') eye: ElementRef;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    private unsubscribeObservables = new Subject();
    resetForm: FormGroup;
    constructor(private loginService: LoginService, private route: ActivatedRoute, private fb:FormBuilder) {}

    ngOnInit(): void {
        this.token = this.route.snapshot.paramMap.get('token');
        this.resetForm = this.fb.group({
            'password': ['', [Validators.required, Validators.minLength(6)]],
            'confirmPassword': ['', Validators.required]
        }, {
            validator: PasswordValidation.matchPassword // your validation method
        });
    this.formControls = this.resetForm.controls;
    this.verifyToken();
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }
    verifyToken() {
        this.loginService.verifyToken(this.token).subscribe((result) => {
            console.log(result);
            if (result.error) {
                this.validToken = false;
            } else {
                this.validToken = true;
            }
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
    updatePassword() {
        this.formSubmitted = true;
        if (this.resetForm.invalid) {
            return;
        } else {
            this.resetButton.nativeElement.disabled = true;
            this.formSubmitted = false;
            this.loginService.resetPassword(this.resetForm.value.password, this.token)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                if(res.error) {
                    this.error = true;
                    this.message = this.message;
                    this.resetButton.nativeElement.disabled = false;
                } else {
                    this.error = false;
                    this.message = res.message;
                    this.resetButton.nativeElement.disabled = false;
                }
            });
        }
    }
}
