import { Component, OnInit, Input, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { SharedService } from '../shared/services/shared.service';
import { Specialities } from '../shared/database/speciality';
import { SocketService } from '../chat/socket.service';
import { SecurityService } from '../shared/services/security.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-doctor-profile',
    templateUrl: 'doctor-profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class DoctorProfileComponent implements OnInit, OnDestroy {

    doctorProfiles: DoctorProfiles;
    userDetails: FormGroup;
    @Input() user: UserDetails;
    @ViewChild('saveButton') saveButton: ElementRef;
    message: string;
    number: Array<number> = [];
    specialitiesDropdownList: Array<any> = [];
    languageList: string[] = [];
    qualificationList: string[] = [];
    consultationModeList: string[] = [];
    locationList: string[] = [];
    dropdownSettings: Object;
    specialityDropdownSettings: Object;
    selectedUser: any;
    private unsubscribeObservables = new Subject();

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private sharedService: SharedService,
        private router: Router,
        private securityService: SecurityService,
        private socketService: SocketService
    ) { }

    ngOnInit() {
        const cookie = JSON.parse(this.securityService.getCookie('userDetails'));
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            this.selectedUser = cookie;
        if (window.localStorage.getItem('pageReloaded') === 'true') {
            this.socketService.connection(this.selectedUser.id);
        }
        this.getLocations();
        this.getLanguages();
        this.getConsultationModes();
        this.getQualifications();
        this.sharedService.getSpecialities()
        .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((specialities: Specialities[]) => {
            console.log(specialities);
            specialities.map((speciality: Specialities) => {
                this.specialitiesDropdownList.push(speciality.name);
            });
            this.profileService.getDoctorProfilesById(this.user.id)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((result: any) => {
                    console.log(result);
                    this.doctorProfiles = result.doctorDetails;
                    const doctorStores = result.doctorStores;
                    let language: string[];
                    let selectedLocation: string[];
                    let consultationMode: string[];
                    let qualification: string[];
                    doctorStores.map((doctorStore: any) => {
                        if (doctorStore.type === 'Language') {
                            return language = doctorStore.value;
                        } else if (doctorStore.type === 'Location') {
                            return selectedLocation = doctorStore.value;
                        } else if (doctorStore.type === 'Consultation mode') {
                            return consultationMode = doctorStore.value;
                        } else if (doctorStore.type === 'Qualification') {
                            return qualification = doctorStore.value;
                        } else {
                            return null;
                        }
                    });
                    this.userDetails = this.fb.group({
                        userId: this.user.id,
                        firstname: [this.user.firstname, Validators.required],
                        lastname: [this.user.lastname, Validators.required],
                        email: [{ value: this.user.email, disabled: true }, Validators.required],
                        password: [{ value: this.user.password, disabled: true }],
                        phoneNo: [{ value: this.user.phoneNo, disabled: true }, Validators.required],
                        aadhaarNo: this.user.aadhaarNo,
                        speciality: [this.doctorProfiles.speciality],
                        regNo: this.doctorProfiles.regNo,
                        sex: this.doctorProfiles.sex,
                        age: this.doctorProfiles.age,
                        shortBio: this.doctorProfiles.shortBio,
                        longBio: this.doctorProfiles.longBio,
                        address: this.doctorProfiles.address,
                        experience: this.doctorProfiles.experience,
                        description: this.doctorProfiles.description,
                        location: [selectedLocation],
                        qualification: [qualification],
                        consultationMode: [consultationMode],
                        language: [language]
                    });
                });
            this.dropdownSettings = {
                singleSelection: false,
                enableCheckAll: false,
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3
            };
            this.specialityDropdownSettings = {
                singleSelection: false,
                enableCheckAll: false,
                unSelectAllText: 'UnSelect All',
                itemsShowLimit: 3,
                allowSearchFilter: true
            };
        });
    }
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    getLocations() {
        this.sharedService.getLocations()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(locations => {
                console.log(locations);
                locations.map((location: any) => {
                    this.locationList.push(location.name);
                });
            });
    }

    getLanguages() {
        this.sharedService.getLanguages()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(languages => {
                console.log(languages);
                languages.map((language: any) => {
                    this.languageList.push(language.name);
                });
            });
    }

    getConsultationModes() {
        this.sharedService.getConsultationModes()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(consultationModes => {
                console.log(consultationModes);
                consultationModes.map((consultationMode: any) => {
                    this.consultationModeList.push(consultationMode.name);
                });
            });
    }

    getQualifications() {
        this.sharedService.getQualifications()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(qualifications => {
                console.log(qualifications);
                qualifications.map((qualification: any) => {
                    this.qualificationList.push(qualification.name);
                });
            });
    }

    update({ value }: { value: any }) {
        this.saveButton.nativeElement.disabled = true;
        this.profileService.updateDoctorProfiles(value)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                this.profileService.updateUserDetails(value)
                    .pipe(takeUntil(this.unsubscribeObservables))
                    .subscribe((res1: any) => {
                        this.user.firstname = value.firstname;
                        this.user.lastname = value.lastname;
                        this.securityService.setCookie('userDetails', JSON.stringify(this.user), 1);
                        this.saveButton.nativeElement.disabled = false;
                        this.message = 'Profile is updated';
                        window.scroll({ top: 0, left: 0, behavior: 'smooth' });
                    });
            });
    }
}
