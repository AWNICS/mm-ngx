import { Component, ViewChild, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'mm-contact',
    templateUrl: 'contact.component.html',
    styleUrls: ['contact.component.css']
})

export class ContactComponent implements OnInit, OnDestroy {

    navIsFixed: boolean = false;
    contactDetails: FormGroup;

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    private unsubscribeObservables = new Subject;

    constructor(
        private fb: FormBuilder,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.contactDetails = this.fb.group({
            name: [null, Validators.required],
            email: [null, Validators.required],
            phoneNumber: [null, Validators.required],
            message: [null, Validators.required]
        });
        window.scrollTo(0, 0);
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
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
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res) => {
                if (res) {
                    return;
                }
            });
    }
}
