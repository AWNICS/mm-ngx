import { Component, OnInit, AfterViewInit, Input, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { UserDetails } from '../shared/database/user-details';
import { ProfileService } from './profile.service';
import { PatientInfo } from '../shared/database/patient-info';
import { ChatService } from '../chat/chat.service';
import { SharedService } from '../shared/services/shared.service';
import { SecurityService } from '../shared/services/security.service';
import { Subject, zip, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-patient-profile',
    templateUrl: 'patient-profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class PatientProfileComponent implements OnInit, OnDestroy {

    userDetails: FormGroup;
    patientInfo: PatientInfo;
    @Input() user: UserDetails;
    message: string;
    reportUploaded: Boolean = false;
    allergyList: string[] = [];
    dropdownSettings = {};
    languageList: string[] = [];
    locationList: string[] = [];
    visitorReport: any = {};
    visitorReportUrl: any;
    @ViewChild('fileUploadName') fileUploadName: ElementRef;
    @ViewChild('submitButton') submitButton: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(
        private fb: FormBuilder,
        private profileService: ProfileService,
        private chatService: ChatService,
        private sharedService: SharedService,
        private securityService: SecurityService,
        private cd: ChangeDetectorRef
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
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((result: any) => {
                console.log(result);
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
                    bloodPressure = '';
                    heartRate = '';
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
                    dob: this.patientInfo.dob,
                    height: this.patientInfo.height,
                    weight: this.patientInfo.weight,
                    bloodGroup: this.patientInfo.bloodGroup,
                    bloodPressure: [bloodPressure],
                    heartRate: heartRate,
                    language: [language],
                    allergies: [allergies],
                    location: [selectedLocation],
                    address: this.patientInfo.address,
                    description: this.user.description,
                    documentType: {value: null, disabled: true},
                    documentTitle: null,
                    documentDescription: null
                });
            });
    }
    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }
    bloodPressure(event){
        const bp = this.userDetails.value.bloodPressure;
        if (bp.split('|')[0] == 0) {
            this.userDetails.patchValue({ bloodPressure: ''});
        }
        if (bp.length <= 3 && bp <= 200 && bp >= 70 && event.which !== 8) {
            this.userDetails.patchValue({ bloodPressure: bp + ' | '});
        }
    }

    getAllergies() {
        this.sharedService.getAllergies()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(allergies => {
                allergies.map((allergy: any) => {
                    this.allergyList.push(allergy.name);
                });
                this.cd.detectChanges();
            });
    }

    getLanguages() {
        this.sharedService.getLanguages()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(languages => {
                languages.map((language: any) => {
                    this.languageList.push(language.name);
                });
                this.cd.detectChanges();
            });
    }

    getLocations() {
        this.sharedService.getLocations()
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(locations => {
                locations.map((location: any) => {
                    this.locationList.push(location.name);
                });
                this.cd.detectChanges();
            });
    }
    update({ value, valid }: { value: any, valid: boolean }) {
        this.message = '';
        const bp = value.bloodPressure;
        console.log(bp);
        if ( bp === '' ) {

        } else if (!(bp.split('|')[0] <= 200) || !(bp.split('|')[0] >= 70) || !(bp.split('|')[1] >= 40) || !(bp.split('|')[1] <= 100) ){
            this.message = 'Enter a Valid value for blood pressure';
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
            return;
        }
        this.visitorReport = {
            visitorId: this.user.id,
            url: this.visitorReportUrl,
            title: value.documentTitle,
            description: value.documentDescription,
            status: 'new',
            createdBy: this.user.id,
            updatedBy: this.user.id
        };
        const one =  this.profileService.updatePatientInfo(value)
            .pipe(takeUntil(this.unsubscribeObservables));
        const two = this.profileService.updateUserDetails(value)
                    .pipe(takeUntil(this.unsubscribeObservables));
        const three = this.reportUploaded ? this.createReport() : new Observable((observer) => { observer.next(1); });
        zip(one, two, three).subscribe( val => {
            this.message = 'Profile is updated';
            this.user.firstname = value.firstname;
            this.user.lastname = value.lastname;
            this.securityService.setCookie('userDetails', JSON.stringify(this.user), 1);
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        },
        (err) => {
            console.log(err);
            this.message = 'Something wrong while updating profile';
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        });
    }

    uploadReport(files: FileList) {
        this.message = '';
        if (files[0].size / (1024 * 1024) > 5) {
            this.message = 'File size larger than 5mb';
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
            return;
        }
        this.submitButton.nativeElement.disabled = true;
        if (files[0].type.match('image')) {
            this.fileUploadName.nativeElement.value = files[0].name;
            this.sharedService.uploadReportsFile(files[0])
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    this.submitButton.nativeElement.disabled = false;
                    this.visitorReportUrl = res.fileName; // setting url of report file
                    this.reportUploaded = true;
                });
        } else if (files[0].type.match('application/pdf')) {
            this.fileUploadName.nativeElement.value = files[0].name;
            this.chatService.uploadFile(files[0])
            .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((res: any) => {
                    this.submitButton.nativeElement.disabled = false;
                    this.visitorReportUrl = res.fileName; // setting url of report file
                    this.reportUploaded = true;
                });
        } else {
            this.submitButton.nativeElement.disabled = false;
            this.message = 'File format not supported';
            window.scroll({ top: 0, left: 0, behavior: 'smooth' });
        }
    }

    createReport() {
        return this.sharedService.createVisitorReport(this.visitorReport)
            .pipe(takeUntil(this.unsubscribeObservables));
    }
}
