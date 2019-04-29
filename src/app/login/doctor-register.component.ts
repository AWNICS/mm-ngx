import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { SharedService } from '../shared/services/shared.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Specialities } from '../shared/database/speciality';
import { PasswordValidation } from './password.validator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-doctor-register',
    templateUrl: 'doctor-register.component.html',
    styleUrls: ['doctor-register.component.css'],
})
export class DoctorRegisterComponent implements OnInit, OnDestroy {

    @ViewChild('msg') msg: ElementRef;
    registerDoctorProfiles: FormGroup;
    f: any;
    message: String;
    error: String;
    otpMessage = '';
    otpFlag: boolean;
    phoneNo: number;
    loader: boolean;
    formSubmitted: Boolean = false;
    number: Array<number> = [];
    specialityDropdownSettings: Object;
    specialitiesDropdownList: Array<any> = [];
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('otpButton') otpButton: ElementRef;
    @ViewChild('phoneNum') phoneNum: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private sharedService: SharedService
    ) {
    }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.sharedService.getSpecialities()
        .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((specialities: Specialities[]) => {
            const specialitiesList: Array<any> = [];
          specialities.map((speciality: Specialities) => {
              specialitiesList.push(speciality.name);
          });
          this.specialitiesDropdownList = specialitiesList;
        });
        this.registerDoctorProfiles = this.fb.group({
            id: null,
            userId: null,
            socketId: null,
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            phoneNo: ['', Validators.required],
            picUrl: null,
            role: null,
            regNo: ['', Validators.required],
            speciality: ['', Validators.required],
            experience: ['', Validators.required],
            description: [''],
            status: null,
            waitingTime: null,
            ratingValue: null,
            ratingCount: null,
            videoUrl: null,
            appearUrl: null,
            token: null,
            type: null,
            activate: null,
            termsAccepted: [''],
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null
        }, {
                validator: PasswordValidation.matchPassword // your validation method
            });
            this.f = this.registerDoctorProfiles.controls;
        this.specialityDropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 2,
            allowSearchFilter: true
          };
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    register({ value, valid }: { value: any, valid: boolean }) {
        this.formSubmitted = true;
        this.error = '';
        this.message = '';
        this.loginService.checkDuplicates(value.email, value.phoneNo).subscribe((res) => {
            if (res.error) {
                this.error = res.message;
            } else {
                if (!this.registerDoctorProfiles.invalid) {
                    const name = value.firstname + ' ' + value.lastname;
                    const split = name.split(' ');
                    value.appearUrl = `https://appear.in/${split[0]}-${split[1]}`;
                    value.createdBy = value.id;
                    value.updatedBy = value.id;
                    value.role = 'doctor';
                    this.loginService.createNewDoctor(value)
                    .pipe(takeUntil(this.unsubscribeObservables))
                        .subscribe((res) => {
                            window.scroll({top: 0, left: 0, behavior: 'smooth'});
                            console.log(res);
                            if (res.error === 'DUP_ENTRY') {
                                this.error = res.message;
                                console.log(this.error);
                            } else if (res) {
                                this.message = `Thank you for registering with us!
                            We will get in touch with you to complete registration process.
                            Kindly check inbox/spam folder for more details.`;
                                this.registerDoctorProfiles.reset();
                            }
                        });
                    } else {
                    return;
                    }
            }
        });
    }

    // sendOtp(phoneNo: any) {
    //     if (phoneNo.length === 10) {
    //         this.loader = true;
    //         this.sharedService.sendOtp(Number('91' + phoneNo))
    //         .pipe(takeUntil(this.unsubscribeObservables))
    //             .subscribe(res => {
    //                 if (res.type === 'success') {
    //                     this.loader = false;
    //                     this.otpFlag = true;
    //                     this.phoneNo = phoneNo;
    //                     this.otpMessage = 'OTP sent successfully!';
    //                 }
    //             });
    //     }
    // }

    // resendOtp() {
    //     this.loader = true;
    //     this.sharedService.resendOtp(Number('91' + this.phoneNo))
    //     .pipe(takeUntil(this.unsubscribeObservables))
    //         .subscribe(res => {
    //             if (res.type === 'success') {
    //                 this.loader = false;
    //                 this.otpFlag = true;
    //                 this.otpMessage = 'OTP re-sent successfully!';
    //             }
    //         });
    // }

    // confirmOtp(otp: number) {
    //     this.loader = true;
    //     this.sharedService.verifyOtp(Number('91' + this.phoneNo), otp)
    //     .pipe(takeUntil(this.unsubscribeObservables))
    //         .subscribe(res => {
    //             if (res.type === 'success') {
    //                 this.loader = false;
    //                 this.otpFlag = false;
    //                 this.otpButton.nativeElement.style.visibility = 'hidden';
    //                 this.otpButton.nativeElement.style.opacity = 0;
    //                 this.phoneNum.nativeElement.disabled = true;
    //             }
    //         });
    // }
}
