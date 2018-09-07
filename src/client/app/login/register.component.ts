import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { PasswordValidation } from './password.validator';
import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { NavbarComponent } from '../shared/navbar/navbar.component';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-register',
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.css'],
})
export class RegisterComponent implements OnInit {
    registerDetails: FormGroup;
    userDetails: UserDetails;
    error = '';
    otpMessage = '';
    otpFlag: boolean;
    phoneNo: number;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('otpButton') otpButton: ElementRef;
    @ViewChild('phoneNum') phoneNum: ElementRef;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService
    ) { }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.registerDetails = this.fb.group({
            id: null,
            socketId: null,
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            phoneNo: ['', Validators.required],
            aadhaarNo: null,
            picUrl: '',
            status: '',
            role: null,
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null
        }, {
                validator: PasswordValidation.matchPassword // your validation method
            });
        this.navbarComponent.navbarColor(0, '#534FFE');
    }

    register({ value, valid }: { value: UserDetails, valid: boolean }) {
        if (this.otpFlag === false) {
            value.status = 'offline';
            value.role = 'patient';
            this.loginService.createNewUser(value)
                .subscribe(res => {
                    window.scroll({top: 0, left: 0, behavior: 'smooth'});
                    breakloop: if (res.error) {
                        if (res.error === 'DUP_ENTRY') {
                            this.error = res.message;
                            break breakloop;
                        }
                    } else {
                        this.registerDetails.reset();
                        this.error = `An email has been sent to your inbox.
                    Please activate your account using the link to login.
                    Kindly check spam folder if not found in your inbox.`;
                    }
                });
        } else {
            this.error = 'Verify your phone number before registering';
            window.scroll({top: 0, left: 0, behavior: 'smooth'});
        }
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
        if (phoneNo.length === 10) {
            console.log('send otp and receive delivered status here ', phoneNo);
            this.otpFlag = true;
            this.phoneNo = phoneNo;
            this.otpMessage = 'OTP sent successfully!';
        }
    }

    resendOtp() {
        console.log('send otp and receive delivered status here ', this.phoneNo);
        this.otpFlag = true;
        this.otpMessage = 'OTP re-sent successfully!';
    }

    confirmOtp(otp: number) {
        console.log('confirm otp here ', otp);
        this.otpFlag = false;
        this.otpButton.nativeElement.style.visibility = 'hidden';
        this.otpButton.nativeElement.style.opacity = 0;
        this.phoneNum.nativeElement.disabled = true;
    }
}
