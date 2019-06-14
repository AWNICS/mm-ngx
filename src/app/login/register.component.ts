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
    message = '';
    timerId: any;
    Math: Math = Math;
    otpMessage = '';
    otpFlag = true;
    phoneNo: number;
    loader: boolean;
    timer: any;
    endTime: any;
    otpStatus: any = {};
    verifyOtp: Boolean;
    userAge: number;
    formSubmitted: Boolean;
    formControls: any;
    dobInvalid: Boolean = false;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('otpButton') otpButton: ElementRef;
    @ViewChild('verifyButton') verifyButton: ElementRef;
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
        this.timer = 2 * 60 * 1000;
        this.endTime = 0;
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
            dob: ['', Validators.required],
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
        this.formControls = this.registerDetails.controls;
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
    displayAge() {
        const userAge = this.registerDetails.value.dob;
        if(userAge.split('-')[0].length > 4){
            this.dobInvalid = true;
        } else {
            this.dobInvalid = false;
        }
        this.otpButton.nativeElement.disabled = true;
        this.userAge = null;
        if (userAge[0] !== '0' && userAge.split('-')[0].length === 4) {
            const dob: any = new Date(userAge);
            const val = Date.now() - dob ;
            const temp: any = new Date(val);
            const age = temp.getYear() - 70;
            this.userAge = age;
            if (this.userAge > 13) {
                this.otpButton.nativeElement.disabled = false;
            } else {
                this.dobInvalid = false;
            }
        }
    }
    submitForm() {
        this.error = '';
        this.message = '';
        this.formSubmitted = true;
        if (this.registerDetails.invalid) {
            return;
        } else {
            this.formSubmitted = false;
            this.otpButton.nativeElement.disabled = true;
            this.loginService.checkDuplicates(this.registerDetails.value.email, this.registerDetails.value.phoneNo).subscribe((res) => {
                if(res.error){
                    this.message = res.message;
                    this.clearErrorAndMessage();
                    this.otpButton.nativeElement.disabled = false;
                } else {
                this.sendOtp(this.registerDetails.value.phoneNo);
                }
            });
        }
    }
    clearErrorAndMessage() {
        setTimeout(() => {
            this.message = '';
            this.error = '';
        }, 8000);
    }
    register() {
        const value = this.registerDetails.value;
            value.status = 'offline';
            value.role = 'patient';
            value.firstname = value.firstname.charAt(0).toUpperCase() + value.firstname.substring(1);
            value.lastname = value.lastname.charAt(0).toUpperCase() + value.lastname.substring(1);
            this.loginService.createNewUser(value)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    if (res.error) {
                        if (res.error === 'DUP_ENTRY') {
                            this.error = res.message;
                            this.clearErrorAndMessage();
                        }
                    } else {
                        this.otpFlag = false;
                        this.userAge = null;
                        this.registerDetails.reset();
                    }
                },
                (err) => {
                    console.log(err);
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
            this.phoneNo = phoneNo;
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
        this.timerId = setInterval(() => {
            console.log(this.timer);
            this.timer = this.timer - 1000;
            if (this.timer <= this.endTime ) {
                this.timer = 0;
                this.endTime = 0;
                clearInterval(this.timerId);
                return;
            }
        }, 1000);
    }
    resendOtp() {
        if (this.timer === 0) {
            this.timer = 2 * 60 * 1000;
            this.runTimer();
            this.sharedService.resendOtp(Number('91' + this.phoneNo))
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    if (res.type === 'success') {
                    this.otpStatus.error = false;
                    this.otpStatus.message = 'OTP Resent Successfully';
                    } else {
                    this.otpStatus.error = true;
                    this.otpStatus.message = 'OTP Resend Failed';
                    }
                });
        }
    }

    confirmOtp(val1: any, val2: any, val3: any, val4: any, val5: any, val6: any ) {
        this.verifyOtp = true;
        this.otpStatus = {};
        this.verifyButton.nativeElement.disabled = true;
        let otp: any = String(val1) + String(val2) + String(val3) + String(val4) + String(val5) + String(val6) ;
        otp = Number(otp);
        this.sharedService.verifyOtp(Number('91' + this.registerDetails.value.phoneNo), otp)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                if (res.type === 'success') {
                    clearInterval(this.timerId);
                    this.verifyOtp = false;
                    this.register();
                } else {
                    this.verifyOtp = false;
                    this.otpStatus.error = true;
                    this.otpStatus.message = 'Invalid OTP. Try again';
                    this.verifyButton.nativeElement.disabled = false;
                    setTimeout(() => {
                        this.otpStatus = {};
                    }, 4000);
                }
            },
            (err) => {
                console.log(err);
                this.verifyButton.nativeElement.disabled = false;
            });
    }
}
