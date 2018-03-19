import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { DoctorDetails } from '../shared/database/doctor-details';
import { ChatService } from '../chat/chat.service';
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

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private chatService: ChatService
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
            name: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            phoneNo: ['', Validators.required],
            picUrl: null,
            role: null,
            regNo: ['', Validators.required],
            speciality: ['', Validators.required],
            experience: ['', Validators.required],
            description: ['', Validators.required],
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
    }

    generateNumber() {
        for (var i = 1; i <= 50; i++ ) {
            this.number.push(i);
        }
    }

    register({ value, valid }: {value: DoctorDetails, valid: boolean }) {
        value.picUrl = 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png';
        value.createdBy = value.name;
        value.updatedBy = value.name;
        value.role = 'doctor';
        if (valid === true) {
            this.loginService.createNewDoctor(value)
            .then((res) => {
                this.message = 'Registration successful!';
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
}
