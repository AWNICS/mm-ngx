import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { Group } from '../shared/database/group';
import { ChatService } from '../chat/chat.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { Router } from '@angular/router';
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
        private loginService: LoginService,
        private chatService: ChatService,
        private router: Router
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
        const name = value.firstname + ' ' + value.lastname;
        const split = name.split(' ');
        value.createdBy = name;
        value.status = 'offline';
        value.role = 'patient';
        value.updatedBy = name;
        this.loginService.createNewUser(value)
            .subscribe(res => {
                this.router.navigate(['/login']);
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
