import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { StaffInfo } from '../shared/database/staff-info';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-staff-profile',
    templateUrl: 'staff-profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class StaffProfileComponent implements OnInit, OnDestroy {

    staffInfo: StaffInfo;
    userDetails: FormGroup;
    @Input() user: UserDetails;
    message: string;
    private unsubscribeObservables = new Subject();

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        this.profileService.getStaffById(this.user.id)
            .pipe(takeUntil(this.unsubscribeObservables))
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

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    update({ value, valid }: { value: any, valid: boolean }) {
        this.profileService.updateStaffInfo(value)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .pipe(takeUntil(this.unsubscribeObservables))
                    .subscribe(res1 => {
                        this.message = 'Profile is updated';
                    });
            });
    }
}
