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
    specialitiesDropdownList:Array<any>=[];
    languagesDropdownList:Array<any> = [];
    qualificationDropdownList:Array<any> = [];
    consultationModeDropdownList:Array<any> = [];
    locationDropdownList:Array<any> = [];
    dropdownSettings:Object;
    specialityDropdownSettings:Object;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.sharedService.getSpecialities().subscribe((specialities:Specialities[])=>{
            specialities.map((speciality:Specialities)=>{
                this.specialitiesDropdownList.push(speciality.name);
            })
        });
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
                    speciality: [this.doctorProfiles.speciality.speciality],
                    regNo: this.doctorProfiles.regNo,
                    sex: this.doctorProfiles.sex,
                    age: this.doctorProfiles.age,
                    shortBio: this.doctorProfiles.shortBio,
                    longBio: this.doctorProfiles.longBio,
                    address: this.doctorProfiles.address,
                    experience: this.doctorProfiles.experience,
                    description: this.doctorProfiles.description,
                    location: [this.doctorProfiles.Location.location],
                    qualification: [this.doctorProfiles.Qualification.qualification],
                    consultationMode: [this.doctorProfiles.ConsultationMode.consultationMode],
                    language: [this.doctorProfiles.Language.language]
                });
            });
        this.generateNumber();
        this.locationDropdownList = ["Bengaluru","Delhi","Kolkata","Mumbai","Chennai"];
        this.consultationModeDropdownList=["Chat","Audio","Video"];
        this.languagesDropdownList=["English","Hindi","Kannada","Telugu","Malayalam","Tamil"];
        this.qualificationDropdownList=["MBBS","MS","MD"];
          this.dropdownSettings = {
            singleSelection: false,
            enableCheckAll:false,
            // idField: 'item_id',
            // textField: 'item_text',
            // selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            // allowSearchFilter: true
          };
          this.specialityDropdownSettings = {
            singleSelection: false,
            enableCheckAll:false,
            unSelectAllText: 'UnSelect All',
            itemsShowLimit: 3,
            allowSearchFilter: true
          };
    }
    
      update({ value }: { value: any }) {
        this.profileService.updateDoctorProfiles(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        window.scrollTo(0,0);
                        this.message = 'Profile is updated';
                    });
            });
    }

    generateNumber() {
        for (var i = 1; i <= 100; i++) {
            this.number.push(i);
        }
    }
}
