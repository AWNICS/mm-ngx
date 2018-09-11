import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { SharedService } from '../shared/services/shared.service';
import { Specialities } from '../shared/database/speciality';

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
    specialitiesDropdownList: Array<any> = [];
    languageList: string[] = [];
    qualificationList: string[] = [];
    consultationModeList: string[] = [];
    locationList: string[] = [];
    dropdownSettings: Object;
    specialityDropdownSettings: Object;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.getLocations();
        this.getLanguages();
        this.getConsultationModes();
        this.getQualifications();
        this.sharedService.getSpecialities().subscribe((specialities: Specialities[]) => {
            specialities.map((speciality: Specialities) => {
                this.specialitiesDropdownList.push(speciality.name);
            });
            this.profileService.getDoctorProfilesById(this.user.id)
                .subscribe(result => {
                    this.doctorProfiles = result.doctorDetails;
                    let doctorStores = result.doctorStores;
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

    getLocations() {
        this.sharedService.getLocations()
            .subscribe(locations => {
                locations.map((location: any) => {
                    this.locationList.push(location.name);
                });
            });
    }

    getLanguages() {
        this.sharedService.getLanguages()
            .subscribe(languages => {
                languages.map((language: any) => {
                    this.languageList.push(language.name);
                });
            });
    }

    getConsultationModes() {
        this.sharedService.getConsultationModes()
            .subscribe(consultationModes => {
                consultationModes.map((consultationMode: any) => {
                    this.consultationModeList.push(consultationMode.name);
                });
            });
    }

    getQualifications() {
        this.sharedService.getQualifications()
            .subscribe(qualifications => {
                qualifications.map((qualification: any) => {
                    this.qualificationList.push(qualification.name);
                });
            });
    }

    update({ value }: { value: any }) {
        this.profileService.updateDoctorProfiles(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        window.scrollTo(0, 0);
                        this.message = 'Profile is updated';
                    });
            });
    }
}
