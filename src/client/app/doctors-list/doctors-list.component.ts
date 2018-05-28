import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { SecurityService } from '../shared/services/security.service';
import { Router } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'mm-doctors-list',
    templateUrl: 'doctors-list.component.html',
    styleUrls: ['doctors-list.component.css']
})

export class DoctorsListComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    doctors: any = [];
    message: string;
    qualifications: string = '';
    languages: string = '';
    consultationModes: string = '';
    locations: string = '';

    constructor(
        private sharedService: SharedService,
        private chatService: ChatService,
        private ref: ChangeDetectorRef,
        private securityService: SecurityService,
        private router: Router
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.getDoctors();
    }

    getDoctors() {
        let location = this.sharedService.getLocation();
        let speciality = this.sharedService.getSpeciality();
        let gps = 39834758;
        let currentTime = '2018-05-22 00:00:00';
        let page = 1;
        let size = 5;
        this.sharedService.getDoctors(location, speciality, gps, currentTime, page, size)
            .subscribe(res => {
                this.doctors = res;
                if (this.doctors.length >= 1) {
                    this.doctors.map((doctor: any) => {
                        console.log('doctor: ' + JSON.stringify(doctor));
                        this.sharedService.getDoctorMedias(doctor.userId)
                            .subscribe(medias => {
                            });
                        this.sharedService.getDoctorStore(doctor.userId)
                            .subscribe(stores => {
                                this.getStores(stores);
                            });
                        if (doctor.picUrl) {
                            this.chatService.downloadFile(doctor.picUrl)
                                .subscribe((res) => {
                                    res.onloadend = () => {
                                        doctor.picUrl = res.result;
                                    };
                                });
                            this.ref.detectChanges();
                        } else {
                            this.chatService.downloadFile('doc.png')
                                .subscribe((res: any) => {
                                    res.onloadend = () => {
                                        doctor.picUrl = res.result;
                                    };
                                });
                            this.ref.detectChanges();
                        }
                    });
                }
            });
    }

    getStores(store: any) {
        for(let i=0; i<store.length; i++) {
            if(store[i].type == 'Qualification') {
                this.qualifications = this.qualifications + ` ${store[i].value}` + ',';
            }
            if(store[i].type == 'Language') {
                this.languages = this.languages + ` ${store[i].value}` + ',';
            }
            if(store[i].type == 'Consultation mode') {
                this.consultationModes = this.consultationModes + ` ${store[i].value}` + ',';
            }
            if(store[i].type == 'Location') {
                this.locations = this.locations + ` ${store[i].value}` + ',';
            }
        }
        this.qualifications = this.qualifications.slice(0, this.qualifications.length-1);
        this.languages = this.languages.slice(0, this.languages.length-1);
        this.consultationModes = this.consultationModes.slice(0, this.consultationModes.length-1);
        this.locations = this.locations.slice(0, this.locations.length-1);
    }

    consultNow(doctorId: number) {
        let user = JSON.parse(this.securityService.getCookie('userDetails'));
        console.log('userId is: ' + user.id + ' and docId is ' + doctorId);
        this.sharedService.consultNow(doctorId, user.id)
            .subscribe((res) => {
                if (res) {
                    this.router.navigate([`/chat/${user.id}`]);
                } else {
                    this.message = 'There was an error. Please re-login and try again.';
                }
            });
    }

    openDoctorProfile(doctor: any) {
        this.router.navigate([`/profiles/doctors/${doctor.userId}`]);
    }
}
