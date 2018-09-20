import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { PatientInfo } from '../shared/database/patient-info';
import { ChatService } from '../chat/chat.service';
import { SharedService } from '../shared/services/shared.service';

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
    allergyList: string[] = [];
    dropdownSettings = {};
    languageList: string[] = [];
    locationList: string[] = [];
    visitorReport: any = '';

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private chatService: ChatService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.getAllergies();
        this.getLanguages();
        this.getLocations();
        this.dropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 2,
            allowSearchFilter: true
        };

        this.profileService.getPatientInfoById(this.user.id)
            .subscribe((result: any) => {
                let language: any;
                let selectedLocation: any;
                let bloodPressure;
                let heartRate;
                let allergies;
                result.visitorStoreInfo.map((visitorStore: any) => {
                    if (visitorStore.type === 'Language') {
                        return language = visitorStore.value;
                    } else if (visitorStore.type === 'Location') {
                        return selectedLocation = visitorStore.value;
                    } else {
                        return null;
                    }
                });
                if (result.visitorHealthInfo.length !== 0) {
                    allergies = result.visitorHealthInfo[0].allergies;
                    bloodPressure = result.visitorHealthInfo[0].vitals.bloodPressure;
                    heartRate = result.visitorHealthInfo[0].vitals.heartRate;
                } else {
                    allergies = [];
                    bloodPressure = [];
                    heartRate = [];
                }
                this.patientInfo = result.patientInfo;
                this.userDetails = this.fb.group({
                    userId: this.user.id,
                    firstname: [this.user.firstname, Validators.required],
                    lastname: [this.user.lastname, Validators.required],
                    email: [{ value: this.user.email, disabled: true }, Validators.required],
                    password: [{ value: this.user.password, disabled: true }],
                    phoneNo: [{ value: this.user.phoneNo, disabled: true }, Validators.required],
                    aadhaarNo: this.user.aadhaarNo,
                    sex: this.patientInfo.sex,
                    age: this.patientInfo.age,
                    height: this.patientInfo.height,
                    weight: this.patientInfo.weight,
                    bloodGroup: this.patientInfo.bloodGroup,
                    bloodPressure: bloodPressure,
                    heartRate: heartRate,
                    language: [language],
                    allergies: [allergies],
                    location: [selectedLocation],
                    address: null,
                    description: this.user.description,
                    documentType: null,
                    documentTitle: null,
                    documentDescription: null
                });
            });
    }

    getAllergies() {
        this.sharedService.getAllergies()
            .subscribe(allergies => {
                allergies.map((allergy: any) => {
                    this.allergyList.push(allergy.name);
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

    getLocations() {
        this.sharedService.getLocations()
            .subscribe(locations => {
                locations.map((location: any) => {
                    this.locationList.push(location.name);
                });
            });
    }

    update({ value, valid }: { value: any, valid: boolean }) {
        this.visitorReport = {
            visitorId: this.user.id,
            type: value.documentType,
            title: value.documentTitle,
            description: value.documentDescription,
            status: 'new',
            createdBy: this.user.id,
            updatedBy: this.user.id
        };
        this.profileService.updatePatientInfo(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        this.message = 'Profile is updated';
                    });
            });
    }

    uploadReport(files: FileList) {
        if (files[0].type.match('image')) {
            this.chatService.uploadFile(files[0])
                .subscribe(res => {
                    this.visitorReport.url = res._body; // setting url of report file
                    this.createReport();
                });
        } else if (files[0].type.match('application')) {
            this.chatService.uploadFile(files[0])
                .subscribe(res => {
                    this.visitorReport.url = res._body; // setting url of report file
                    this.createReport();
                });
        } else {
            this.message = 'File format not supported';
        }
    }

    createReport() {
        this.sharedService.createVisitorReport(this.visitorReport)
            .subscribe(res => {
                console.log('res ', res);
                return;
            });
    }
}
