import { Component, OnInit, Output } from '@angular/core';

import { ContactUsService } from './contact-us.service';
import { ContactUs } from '../shared/database/contact-us';

import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

/**
 * ContactUs component for conveying message
 */

@Component({
    moduleId: module.id,
    selector: 'mm-contact-us',
    templateUrl: 'contact-us.component.html',
    styleUrls: ['contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

    message: FormGroup;
    messages: ContactUs[];

    constructor(private fb: FormBuilder, private contactUsService: ContactUsService) {
        this.getMessages();
    }

    ngOnInit() {
        this.message = this.fb.group({
            fullName: [''],
            emailId: [''],
            message: ['']
        });
    }

    onSubmit({ value, valid }: { value: ContactUs, valid: boolean }) {
        this.contactUsService.submitMessage();
        this.add({ value, valid });
    }

    add({ value, valid }: { value: ContactUs, valid: boolean }): void {
        let result = JSON.stringify(value);
        if (!result) {
            return;
        }
        this.contactUsService.create(value)
            .then(message => {
                this.messages.push(message);
                console.log(JSON.stringify(value));
            });
    }

    /**
     * function to get the messages stored in the database
     * @memberof ContactUsComponent
     */
    getMessages() {
        this.contactUsService.getMessages()
            .then((message) => {
                this.messages = message;
            });
    }
}
