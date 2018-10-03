import { Component, ViewChild, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';

@Component({
    moduleId: module.id,
    selector: 'mm-contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})

export class ContactComponent implements OnInit {

    navIsFixed: boolean = false;
    contactDetails: FormGroup;

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

    constructor(
        private fb: FormBuilder,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.contactDetails = this.fb.group({
            name: null,
            email: null,
            phoneNumber: null,
            message: null
        });
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        let number = window.scrollY;
        if (number > 500) {
            this.navIsFixed = true;
            document.getElementById('myBtn').style.display = 'block';
        } else if (this.navIsFixed && number < 1000) {
            this.navIsFixed = false;
            document.getElementById('myBtn').style.display = 'none';
        }

        //for moving to next section and to show navbar
        if (number > 100) {
            this.navbarComponent.navbarColor(number, '#6960FF');
        } else {
            this.navbarComponent.navbarColor(number, 'transparent');
        }
    }

    sendMail({ value, valid }: { value: any, valid: boolean }) {
        this.sharedService.sendMail(value)
            .subscribe((res) => {
                return;
            });
    }
}
