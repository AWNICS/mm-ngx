import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { Group } from '../shared/database/group';
import { ChatService } from '../chat/chat.service';
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
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    constructor(
        private fb: FormBuilder,
        private loginService: LoginService,
        private chatService: ChatService
    ) { }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.registerDetails = this.fb.group({
            id: null,
            socketId: null,
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            phoneNo: '',
            picUrl: '',
            status: '',
            appearUrl: null,
            role: null,
            createdTime: '',
            createdBy: null,
            updatedTime: '',
            updatedBy: null
        });
        this.navbarComponent.navbarColor(0, '#534FFE');
    }

    register({ value, valid }: { value: UserDetails, valid: boolean }) {
        const name = value.firstname + value.lastname;
        const split = name.split(' ');
        value.createdBy = name;
        value.status = 'offline';
        value.appearUrl = `https://appear.in/mm-${split}`;
        value.role = 'patient';
        value.updatedBy = name;
        this.loginService.createNewUser(value)
            .then(response => response)
            .catch(error => error);
    }
}
