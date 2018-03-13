import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
    registerDoctorDetails: FormGroup;
    doctorDetails: DoctorDetails;
    number: Array<number> = [];

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private chatService: ChatService
    ) { 
        this.generateNumber();
    }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.registerDoctorDetails = this.fb.group({
            id: null,
            socketId: null,
            name: [''],
            email: [''],
            password: [''],
            phoneNo: [''],
            picUrl: null,
            role: null,
            regNo: null,
            speciality: null,
            experience: null,
            description: null,
            status: null,
            waitingTime: null,
            rating: null,
            videoUrl: null,
            appearUrl: null,
            token: null,
            activate: null,
            termsAccepted: null,
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null,
        });
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
        this.loginService.createNewDoctor(value)
        .then(response => response)
        .catch(error => error);
    }
}
