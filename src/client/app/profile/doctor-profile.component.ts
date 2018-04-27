import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DoctorDetails } from '../shared/database/doctor-details';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-profile',
    templateUrl: 'doctor-profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class DoctorProfileComponent implements OnInit {

    doctorDetails: DoctorDetails;
    userDetails: FormGroup;
    @Input() user: UserDetails;
    message: string;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        this.profileService.getDoctorDetailsById(this.user.id)
            .subscribe(doctorDetails => {
                this.doctorDetails = doctorDetails;
                this.userDetails = this.fb.group({
                    id: this.user.id,
                    userId: this.user.id,
                    firstname: [this.user.firstname, Validators.required],
                    lastname: [this.user.lastname, Validators.required],
                    email: [{ value: this.user.email, disabled: true }, Validators.required],
                    password: [{ value: this.user.password, disabled: true }],
                    phoneNo: [{ value: this.user.phoneNo, disabled: true }, Validators.required],
                    aadhaarNo: this.user.aadhaarNo,
                    speciality: this.doctorDetails.speciality,
                    regNo: this.doctorDetails.regNo,
                    sex: this.doctorDetails.sex,
                    location: this.doctorDetails.location,
                    address: this.doctorDetails.address,
                    experience: this.doctorDetails.experience,
                    description: this.doctorDetails.description
                });
            });
    }

    update({ value, valid }: { value: any, valid: boolean }) {
        this.profileService.updateDoctorDetails(value)
            .subscribe(res => {
                console.log('res ', res);
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        this.message = 'Profile is updated';
                    });
            });
    }
}
