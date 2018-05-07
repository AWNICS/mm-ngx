import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { StaffInfo } from '../shared/database/staff-info';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-staff-profile',
    templateUrl: 'staff-profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class StaffProfileComponent implements OnInit {

    staffInfo: StaffInfo;
    userDetails: FormGroup;
    @Input() user: UserDetails;
    message: string;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        this.profileService.getStaffById(this.user.id)
            .subscribe(staffInfo => {
                this.staffInfo = staffInfo;
                this.userDetails = this.fb.group({
                    userId: this.user.id,
                    firstname: [this.user.firstname, Validators.required],
                    lastname: [this.user.lastname, Validators.required],
                    email: [{ value: this.user.email, disabled: true }, Validators.required],
                    password: [{ value: this.user.password, disabled: true }],
                    phoneNo: [{ value: this.user.phoneNo, disabled: true }, Validators.required],
                    aadhaarNo: this.user.aadhaarNo,
                    sex: this.staffInfo.sex,
                    location: this.staffInfo.location,
                    address: this.staffInfo.address,
                    staffId: this.staffInfo.staffId,
                    department: this.staffInfo.department
                });
            });
    }

    update({ value, valid }: { value: any, valid: boolean }) {
        this.profileService.updateStaffInfo(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        this.message = 'Profile is updated';
                    });
            });
    }
}
