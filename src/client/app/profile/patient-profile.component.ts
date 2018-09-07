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
    allergyList = ["Dust", "Peanuts", "Butter", "Smoke"];
    dropdownSettings = {};
    languageList = ["English", "Hindi", "Kannada", "Bengali", "Punjabi"];
    locationList = ["Bangalore", "Delhi", "Mumbai", "Kolkata", "Chennai"];
    visitorReport: any;

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private chatService: ChatService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.dropdownSettings = {
            singleSelection: false,
            enableCheckAll: false,
            itemsShowLimit: 3,
            allowSearchFilter: true
        };

        this.profileService.getPatientInfoById(this.user.id)
            .subscribe((result: any) => {
                let language: any;
                let selectedLocation: any;
                let visitorStores = result.visitorStoreInfo;
                visitorStores.map((visitorStore: any) => {
                    if (visitorStore.type === 'Language') {
                        return language = visitorStore.value;
                    } else if(visitorStore.type === 'Location'){
                        return selectedLocation = visitorStore.value;
                    } else {
                        return null;
                    }
                });
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
                    bloodPressure: result.visitorPrescriptionInfo.description.vitals['Blood pressure'],
                    heartRate: result.visitorPrescriptionInfo.description.vitals['Heart rate'],
                    language: [language.language],
                    allergies: [result.visitorHealthInfo.allergies.allergy],
                    location: [selectedLocation.location],
                    address: null,
                    description: this.user.description,
                    documentType:null,
                    documentTitle: null,
                    documentDescription: null
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
        }
        this.profileService.updatePatientInfo(value)
            .subscribe(res => {
                this.profileService.updateUserDetails(value)
                    .subscribe(res => {
                        this.message = 'Profile is updated';
                    });
            });
    }

    onItemSelect(item: any) { }
    onSelectAll(items: any) { }

    uploadReport(files: FileList) {
        if (files[0].type.match('image')) {
            this.chatService.uploadFile(files[0])
                .subscribe(res => {
                    this.visitorReport.url = res._body; // setting url of report file
                    this.createReport('image', files[0]);
                });
        } else if (files[0].type.match('application')) {
            this.chatService.uploadFile(files[0])
                .subscribe(res => {
                    this.visitorReport.url = res._body; // setting url of report file
                    this.createReport('PDF/Doc', files[0]);
                });
        } else {
            console.log('File format not supported');
        }
    }

    createReport(type: string, file: File) {
        this.sharedService.createVisitorReport(this.visitorReport)
            .subscribe(res => {});
    }
}
