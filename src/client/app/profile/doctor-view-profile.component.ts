import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { DoctorProfiles } from '../shared/database/doctor-profiles';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-view-profile',
    templateUrl: 'doctor-view-profile.component.html',
    styleUrls: ['doctor-view-profile.component.css'],
})
export class DoctorViewProfileComponent implements OnInit {

    @Input() user: UserDetails;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('modal') modal: ElementRef;

    rating = 4;

    constructor(
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    openModal() {
        this.modal.nativeElement.style.display = 'block';
    }

    closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }
}
