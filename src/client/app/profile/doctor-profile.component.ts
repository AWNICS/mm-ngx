import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
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

    doctorProfiles: DoctorProfiles;
    userDetails: FormGroup;
    @Input() user: UserDetails;
    message: string;
    number: Array<number> = [];

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        this.profileService.getDoctorProfilesById(this.user.id)
            .subscribe(doctorProfiles => {
                this.doctorProfiles = doctorProfiles;
                this.userDetails = this.fb.group({
                    userId: this.user.id,
                    firstname: [this.user.firstname, Validators.required],
                    lastname: [this.user.lastname, Validators.required],
                    email: [{ value: this.user.email, disabled: true }, Validators.required],
                    password: [{ value: this.user.password, disabled: true }],
                    phoneNo: [{ value: this.user.phoneNo, disabled: true }, Validators.required],
                    aadhaarNo: this.user.aadhaarNo,
                    speciality: this.doctorProfiles.speciality,
                    regNo: this.doctorProfiles.regNo,
                    sex: this.doctorProfiles.sex,
                    age: this.doctorProfiles.age,
                    shortBio: this.doctorProfiles.shortBio,
                    longBio: this.doctorProfiles.longBio,
                    address: this.doctorProfiles.address,
                    experience: this.doctorProfiles.experience,
                    description: this.doctorProfiles.description,
                    location: this.doctorProfiles.location,
                    qualification: this.doctorProfiles.qualification,
                    consultationMode: this.doctorProfiles.consultationMode,
                    language: this.doctorProfiles.language
                });
            });
        this.generateNumber();
    }

    update({ value, valid }: { value: any, valid: boolean }) {
        this.profileService.updateDoctorProfiles(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        this.message = 'Profile is updated';
                    });
            });
    }

    generateNumber() {
        for (var i = 1; i <= 50; i++ ) {
            this.number.push(i);
        }
    }
}
