import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginService } from './login.service';
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
            name: '',
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    register(registerDetails: any) {
        console.log('Registered successfully! ' + registerDetails);
        this.loginService.registered();
    }
}
