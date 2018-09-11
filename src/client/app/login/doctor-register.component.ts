import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { SharedService } from '../shared/services/shared.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Specialities } from '../shared/database/speciality';
import { PasswordValidation } from './password.validator';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-register',
    templateUrl: 'doctor-register.component.html',
    styleUrls: ['doctor-register.component.css'],
})
export class DoctorRegisterComponent implements OnInit {

    @ViewChild('msg') msg: ElementRef;
    registerDoctorProfiles: FormGroup;
    message = '';
    otpMessage = '';
    otpFlag: boolean;
    phoneNo: number;
    loader: boolean;
    number: Array<number> = [];
    specialityDropdownSettings:Object;
    specialitiesDropdownList:Array<any>=[];
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('otpButton') otpButton: ElementRef;
    @ViewChild('phoneNum') phoneNum: ElementRef;

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
        this.sharedService.getSpecialities().subscribe((specialities:Specialities[])=> {
            let specialitiesList:Array<any> = [];
          specialities.map((speciality:Specialities)=> {
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
            termsAccepted: ['', Validators.required],
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null
        }, {
                validator: PasswordValidation.matchPassword // your validation method
            });
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.specialityDropdownSettings = {
            singleSelection: false,
            enableCheckAll:false,
            itemsShowLimit: 2,
            allowSearchFilter: true
          };
    }

    register({ value, valid }: { value: any, valid: boolean }) {
        if (this.otpFlag === false) {
            const name = value.firstname + ' ' + value.lastname;
            const split = name.split(' ');
            value.appearUrl = `https://appear.in/mm-${split[0]}-${split[1]}`;
            value.createdBy = value.id;
            value.updatedBy = value.id;
            value.role = 'doctor';
            this.loginService.createNewDoctor(value)
                .subscribe((res) => {
                    window.scroll({top: 0, left: 0, behavior: 'smooth'});
                    breakloop: if (res.error === 'DUP_ENTRY') {
                        this.message = res.message;
                        break breakloop;
                    } else if (res) {
                        this.message = `Thank you for registering with us!
                    We will get in touch with you to complete registration process.
                    Kindly check inbox/spam folder for more details.`;
                        this.registerDoctorProfiles.reset();
                    }
                });
        } else {
            this.message = 'Verify your phone number before registering';
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
            this.loader = true;
            this.sharedService.sendOtp(Number('91'+phoneNo))
                .subscribe(res => {
                    if (res.type === 'success') {
                        this.loader = false;
                        this.otpFlag = true;
                        this.phoneNo = phoneNo;
                        this.otpMessage = 'OTP sent successfully!';
                    }
                });
        }
    }

    resendOtp() {
        this.loader =true;
        this.sharedService.resendOtp(Number('91'+this.phoneNo))
            .subscribe(res => {
                if (res.type === 'success') {
                    this.loader = false;
                    this.otpFlag = true;
                    this.otpMessage = 'OTP re-sent successfully!';
                }
            });
    }

    confirmOtp(otp: number) {
        this.loader = true;
        this.sharedService.verifyOtp(Number('91'+this.phoneNo), otp)
            .subscribe(res => {
                if (res.type === 'success') {
                    this.loader = false;
                    this.otpFlag = false;
                    this.otpButton.nativeElement.style.visibility = 'hidden';
                    this.otpButton.nativeElement.style.opacity = 0;
                    this.phoneNum.nativeElement.disabled = true;
                }
            });
    }
}
