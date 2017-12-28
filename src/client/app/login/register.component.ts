import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
import { UserDetails } from '../shared/database/userDetails';
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
        private loginService: LoginService
    ) { }

    /**
     * initialising form group
     * @memberOf RegisterComponent
     */
    ngOnInit(): void {
        this.registerDetails = this.fb.group({
            id: null,
            name: [''],
            email: [''],
            phoneNo: [''],
            picUrl: null,
            briefDescription: {
                description: null
            },
            status: null,
            waitingTime: null,
            rating: null,
            lastUpdateTime: null
        });
    }

    register({ value, valid }: {value: UserDetails, valid: boolean}) {
        //console.log('Registered successfully! ' + registerDetails);
        this.loginService.createNewUser(value)
        .subscribe((res) => console.log(res));
    }
}
