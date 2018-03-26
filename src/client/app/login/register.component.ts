import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/user-details';
import { Group } from '../shared/database/group';
import { ChatService } from '../chat/chat.service';
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
            name: '',
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
    }

    register({ value, valid }: { value: UserDetails, valid: boolean }) {
        const split = value.name.split(' ');
        value.picUrl = 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png';
        value.createdBy = value.name;
        value.status = 'offline';
        value.appearUrl = `https://appear.in/mm-${split}`;
        value.role = 'patient';
        value.updatedBy = value.name;
        this.loginService.createNewUser(value)
            .then(response => response)
            .catch(error => error);
    }
}
