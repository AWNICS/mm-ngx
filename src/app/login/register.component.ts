import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PasswordValidation } from './password.validator';
import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
    registerDetails: FormGroup;
    userDetails: UserDetails;
    error = '';
    Math: Math = Math;
    otpMessage = '';
    otpFlag = true;
    phoneNo: number;
    loader: boolean;
    timer: any;
    endTime: any;
    verifyOtp: Boolean;
    f: any;
    formSubmitted: Boolean;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('otpButton') otpButton: ElementRef;
    @ViewChild('otpInput') otpInput: ElementRef;
    @ViewChild('phoneNum') phoneNum: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private sharedService: SharedService,
        private cd: ChangeDetectorRef
    ) { }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.timer = 30 * 60 * 1000 + (2 * 60 * 1000);
        this.endTime = 30 * 60 * 1000;
        this.registerDetails = this.fb.group({
            id: null,
            socketId: null,
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', Validators.required],
            phoneNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
            aadhaarNo: null,
            picUrl: '',
            status: '',
            role: null,
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null,
            termsAccepted: ['']
        }, {
                validator: PasswordValidation.matchPassword // your validation method
            });
        // this.navbarComponent.navbarColor(0, '#534FFE');
        this.f = this.registerDetails.controls;
    }
    ngAfterViewInit(){
        if (this.otpInput) {
        this.otpInput.nativeElement.addEventListener('input', (value: any) => {
        if (value.data) {
            if (value.data.match(/[0-9]/)) {
                if (value.path[1].children[5] !== value.srcElement) {
                    value.srcElement.nextSibling.focus();
                } else{
                    value.path[1].children[0].focus();
                }
            }
        }
        });
        }
    }
    ngOnDestroy() {
        const win: any = window;
        if(win.$('#otp-window')[0].className === 'modal fade show') {
            win.$('#otp-window').modal('hide');
        }
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }
    submitForm(){
        this.formSubmitted = true;
        if (this.registerDetails.invalid) {
            console.log('retusdf');
            return;
        } else {
            this.formSubmitted = false;
            this.sendOtp(this.registerDetails.value.phoneNo);
        }
    }
    register() {
        const value = this.registerDetails.value;
            value.status = 'offline';
            value.role = 'patient';
            this.loginService.createNewUser(value)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    breakloop: if (res.error) {
                        if (res.error === 'DUP_ENTRY') {
                            this.error = res.message;
                            break breakloop;
                        }
                    } else {
                        this.otpFlag = false;
                        this.registerDetails.reset();
                    //     this.error = `An email has been sent to your inbox.
                    // Please activate your account using the link to login.
                    // Kindly check spam folder if not found in your inbox.`;
                    }
                });
}

    checkPhoneNumber(value: any) {
        if (value.length === 10) {
            this.otpButton.nativeElement.style.visibility = 'visible';
            this.otpButton.nativeElement.style.opacity = 1;
        } else {
            this.otpButton.nativeElement.style.visibility = 'hidden';
            this.otpButton.nativeElement.style.opacity = 0;
        }
    }

    sendOtp(phoneNo: any) {
        this.loader = true;
        if (phoneNo.length === 10 && this.registerDetails.valid) {
            this.loader = true;
            this.sharedService.sendOtp(Number('91' + phoneNo))
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    if (res.type === 'success') {
                        const win: any = window;
                        win.$('#otp-window').modal('show');
                        this.loader = false;
                        this.runTimer();
                        this.otpFlag = true;
                    }
                });
        }
    }
    runTimer() {
        const timer = setInterval(() => {
            this.timer = this.timer - 1000;
            if (this.timer <= this.endTime ) {
                this.timer = 30 * 60 * 1000 + (2 * 60 * 1000);
                this.endTime = 30 * 60 * 1000;
                clearInterval(timer);
            }
        }, 1000);
    }
    resendOtp() {
        this.loader = true;
        this.sharedService.resendOtp(Number('91' + this.phoneNo))
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                if (res.type === 'success') {
                    this.loader = false;
                }
            });
    }

    confirmOtp(val1: any, val2: any, val3: any, val4: any, val5: any, val6: any ) {
        this.verifyOtp = true;
        let otp:any = String(val1) + String(val2) + String(val3) + String(val4) + String(val5) + String(val6) ;
        otp = Number(otp);
        console.log(otp);
        this.sharedService.verifyOtp(Number('91' + this.registerDetails.value.phoneNo), otp)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                if (res.type === 'success') {
                    this.verifyOtp = false;
                    this.register();
                }
            });
    }
}
