import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { SecurityService } from '../shared/services/security.service';
import { Router } from '@angular/router';
var moment = require('moment');

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
        let currentTime = '2018-05-21 14:07:00';
        let page = 1;
        let size = 5;
        this.sharedService.getDoctors(location, speciality, gps, currentTime, page, size)
            .subscribe(res => {
                this.doctors = res;
                if (this.doctors.length >= 1) {
                    this.doctors.map((doctor: any) => {
                        this.sharedService.getDoctorScheduleByDoctorId(doctor.userId)
                            .subscribe(response => {
                                let updatedAt = new Date(response[response.length-1].updatedAt);
                                let currentTime = new Date();
                                let ms = moment(currentTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(updatedAt, 'DD/MM/YYYY HH:mm:ss'));
                                let date = moment.duration(ms);
                                doctor.lastupdated = this.getLastUpdated(date);
                            });
                        //doctor media in case if it required
                        /*this.sharedService.getDoctorMedias(doctor.userId)
                            .subscribe(medias => {
                            });*/
                        this.sharedService.getDoctorStore(doctor.userId)
                            .subscribe(stores => {
                                this.getStores(stores, doctor.userId);
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
    /**
     * doctor stores for all the listed doctors
     * @param stores
     * @param doctorId
     */
    getStores(stores: any, doctorId: number) {
        let qualifications = '';
        let languages = '';
        let consultationModes = '';
        let locations = '';
        for (let i = 0; i < stores.length; i++) {
            if (stores[i].type === 'Qualification' && stores[i].userId === doctorId) {
                qualifications = qualifications + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Language' && stores[i].userId === doctorId) {
                languages = languages + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Consultation mode' && stores[i].userId === doctorId) {
                consultationModes = consultationModes + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Location' && stores[i].userId === doctorId) {
                locations = locations + ` ${stores[i].value}` + ',';
            }
        }
        qualifications = qualifications.slice(0, qualifications.length - 1);
        languages = languages.slice(0, languages.length - 1);
        consultationModes = consultationModes.slice(0, consultationModes.length - 1);
        locations = locations.slice(0, locations.length - 1);

        //iterate the doctors[] array and assign the required variable and use it inside the html
        for (let i = 0; i < this.doctors.length; i++) {
            if (this.doctors[i].userId === doctorId) {
                this.doctors[i].qualificationStr = qualifications;
                this.doctors[i].languageStr = languages;
                this.doctors[i].consultationModeStr = consultationModes;
                this.doctors[i].locationStr = locations;
            }
        }
    }

    consultNow(doctorId: number) {
        let user = JSON.parse(this.securityService.getCookie('userDetails'));
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

    getLastUpdated(date: any) {
        if (date.days() > 0) {
            return date.days() + ' days';
        } else if (date.hours() > 0) {
            return date.hours() + ' hours';
        } else if (date.minutes() > 0) {
            return date.minutes() + ' mins';
        } else if (date.seconds() > 0) {
            return date.seconds() + ' secs';
        } else {
            return 'few secs';
        }
    }
}
