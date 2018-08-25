import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
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

    @ViewChild('msg') msg : ElementRef;
    registerDoctorProfiles: FormGroup;
    message = '';
    number: Array<number> = [];
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService
    ) {
    }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.registerDoctorProfiles = this.fb.group({
            id: null,
            userId: null,
            socketId: null,
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            confirmPassword:['', Validators.required],
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
        });
        this.generateNumber();
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    generateNumber() {
        for (var i = 1; i <= 50; i++ ) {
            this.number.push(i);
        }
    }

    register({ value, valid }: {value: any, valid: boolean }) {
        const name = value.firstname + ' ' + value.lastname;
        const split = name.split(' ');
        value.appearUrl = `https://appear.in/mm-${split[0]}-${split[1]}`;
        value.createdBy = value.id;
        value.updatedBy = value.id;
        value.role = 'doctor';
        if (valid === true) {
            this.loginService.createNewDoctor(value)
            .subscribe((res) => {
                window.scroll(0,0);
               breakloop: if(res.error==="DUP_ENTRY"){
                    this.message=res.message;
                    break breakloop;                 
                }
                else if(res) {
                    this.message = `Thank you for registering with us!
                    We will get in touch with you to complete registration process.
                    Kindly check inbox/spam folder for more details.`;
                    this.registerDoctorProfiles.reset();
                } else {
                    this.message = 'Registration unsuccessful. Please try again!';
                }
            });
          } else {
            window.scroll(0,0);
            this.message = 'Registration unsuccessful. Please try again!';
          }
    }

    validatePassword({ value, valid }: {value: any, valid: boolean }) {
        if(value.password === value.confirmPassword) {
            this.message = '';
            return;
        } else {
            window.scroll(0,0);
            this.message = 'Passwords do not match';
        }
    }
}
