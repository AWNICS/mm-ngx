import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { PatientInfo } from '../shared/database/patient-info';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-patient-profile',
    templateUrl: 'patient-profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class PatientProfileComponent implements OnInit {

    userDetails: FormGroup;
    patientInfo: PatientInfo;
    @Input() user: UserDetails;
    message: string;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        this.profileService.getPatientInfoById(this.user.id)
            .subscribe((patientInfo) => {
                this.patientInfo = patientInfo;
                this.userDetails = this.fb.group({
                    id: this.user.id,
                    userId: this.user.id,
                    firstname: [this.user.firstname, Validators.required],
                    lastname: [this.user.lastname, Validators.required],
                    email: [{ value: this.user.email, disabled: true }, Validators.required],
                    password: [{ value: this.user.password, disabled: true }],
                    phoneNo: [{ value: this.user.phoneNo, disabled: true }, Validators.required],
                    aadhaarNo: this.user.aadhaarNo,
                    sex: this.patientInfo.sex,
                    height: this.patientInfo.height,
                    weight: this.patientInfo.weight,
                    bloodGroup: this.patientInfo.bloodGroup,
                    allergies: this.patientInfo.allergies,
                    location: this.patientInfo.location,
                    address: this.patientInfo.address,
                    description: this.user.description
                });
            });
    }

    update({ value, valid }: { value: any, valid: boolean }) {
        this.profileService.updatePatientInfo(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        this.message = 'Profile is updated';
                    });
            });
    }

}
