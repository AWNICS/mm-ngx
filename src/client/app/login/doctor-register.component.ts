import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { DoctorDetails } from '../shared/database/doctor-details';
import { ChatService } from '../chat/chat.service';
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
    registerDoctorDetails: FormGroup;
    doctorDetails: DoctorDetails;
    message = '';
    number: Array<number> = [];
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private chatService: ChatService,
    ) {
    }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.registerDoctorDetails = this.fb.group({
            id: null,
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
            rating: null,
            videoUrl: null,
            appearUrl: null,
            token: null,
            activate: null,
            termsAccepted: ['', Validators.required],
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null,
        });
        this.generateNumber();
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    generateNumber() {
        for (var i = 1; i <= 50; i++ ) {
            this.number.push(i);
        }
    }

    register({ value, valid }: {value: DoctorDetails, valid: boolean }) {
        const name = value.firstname + ' ' + value.lastname;
        const split = name.split(' ');
        value.appearUrl = `https://appear.in/mm-${split}`;
        value.createdBy = name;
        value.updatedBy = name;
        value.role = 'doctor';
        if (valid === true) {
            this.loginService.createNewDoctor(value)
            .subscribe((res) => {
                this.message = 'Registration successful!';
                this.msg.nativeElement.innerText = 'Registration success';
                this.registerDoctorDetails.reset();
                setTimeout(() => {
                    this.msg.nativeElement.style.display = 'none';
                  }, 5000);
            });
          } else {
            this.message = 'Registration unsuccessful. Please try again later!';
            setTimeout(() => {
                this.msg.nativeElement.style.display = 'none';
            }, 10000);
          }
    }

    validatePassword({ value, valid }: {value: any, valid: boolean }) {
        if(value.password === value.confirmPassword) {
            this.message = '';
            return;
        } else {
            this.message = 'Passwords do not match';
        }
    }
}
