import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

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
            confirmPassword:['', Validators.required],
            phoneNo: ['', Validators.required],
            aadhaarNo: null,
            picUrl: '',
            status: '',
            role: null,
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null
        });
        this.navbarComponent.navbarColor(0, '#534FFE');
    }

    register({ value, valid }: { value: UserDetails, valid: boolean }) {
        value.status = 'offline';
        value.role = 'patient';
        this.loginService.createNewUser(value)
            .subscribe(res => {
                if(res) {
                    this.registerDetails.reset();
                    this.error = `An email has been sent to your inbox.
                    Please activate your account using the link to login.
                    Kindly check spam folder if not found in your inbox.`;
                }
            });
    }

    validatePassword({ value, valid }: { value: any, valid: boolean }) {
        if(value.password === value.confirmPassword) {
            this.error = '';
            return;
        } else {
            this.error = 'Passwords do not match';
        }
    }
}
