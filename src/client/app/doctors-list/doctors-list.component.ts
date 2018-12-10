import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { SecurityService } from '../shared/services/security.service';
import { Router } from '@angular/router';
var moment = require('moment');
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'mm-doctors-list',
    templateUrl: 'doctors-list.component.html',
    styleUrls: ['doctors-list.component.css']
})

export class DoctorsListComponent implements OnInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    doctors: any = [];
    message: string;
    selectedUser:any;
    private unsubscribeObservables:any = new Subject();

    constructor(
        private sharedService: SharedService,
        private chatService: ChatService,
        private socketService: SocketService,
        private ref: ChangeDetectorRef,
        private securityService: SecurityService,
        private router: Router
    ) { }

    ngOnInit() {
         this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        if(window.localStorage.getItem('pageReloaded')) {
            console.log('Page Reloaded');
            this.socketService.connection(this.selectedUser.id);
        }
        if (this.selectedUser && this.selectedUser.role === 'doctor') {
            this.router.navigate([`/dashboards/doctors/${this.selectedUser.id}`]);
        } else if ( this.selectedUser.role === 'admin') {
            this.router.navigate([`/admin/${this.selectedUser.id}`]);
        } else {
            this.navbarComponent.navbarColor(0, '#6960FF');
            this.getDoctors();
            this.receiveConsultNow(this.selectedUser);
        }
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
      }


    getDoctors() {
        let location = this.sharedService.getLocation();
        let speciality = this.sharedService.getSpeciality();
        let gps = 39834758;
        let currentTime = moment(Date.now()).format();
        let page = 1;
        let size = 5;
        if (location && speciality) {
            this.sharedService.getDoctors(this.selectedUser.id, location, speciality, gps, currentTime, page, size)
            .takeUntil(this.unsubscribeObservables)
                .subscribe(res => {
                    if (res.length <= 0) {
                        this.message = 'There are no doctors available currently. Try again later!';
                    } else {
                        this.doctors = res.doctors;
                        if (this.doctors.length >= 1) {
                            this.doctors.map((doctor: any) => {
                                if(res.inactiveGroups.doctorId.length > 0) {
                                res.inactiveGroups.doctorId.map((doctorId:any)=> {
                                    if(doctor.userId===doctorId) {
                                        doctor.message = 'chat';
                                    }
                                });
                            } else {
                                let count=0;
                                res.consultations.doctorId.map((doctorId:any)=> {
                                    if(doctor.userId===doctorId) {
                                        count++;
                                        count===1?doctor.message = `You had consulted this doctor ${count} time`:
                                        doctor.message = `You had consulted this doctor ${count} times`;
                                    }
                                });
                            }
                                doctor.speciality = JSON.parse(doctor.speciality);
                                this.sharedService.getDoctorScheduleByDoctorId(doctor.userId)
                                .takeUntil(this.unsubscribeObservables)
                                    .subscribe(response => {
                                        let updatedAt = new Date(response[response.length - 1].updatedAt);
                                        let currentTime = new Date();
                                        let ms = moment(currentTime, 'DD/MM/YYYY HH:mm:ss').diff(moment(updatedAt, 'DD/MM/YYYY HH:mm:ss'));
                                        let date = moment.duration(ms);
                                        doctor.lastupdated = this.getLastUpdated(date);
                                    });
                                this.sharedService.getDoctorStore(doctor.userId)
                                .takeUntil(this.unsubscribeObservables)
                                    .subscribe(stores => {
                                        this.getStores(stores, doctor.userId);
                                    });
                                if (doctor.picUrl) {
                                    this.chatService.downloadFile(doctor.picUrl)
                                    .takeUntil(this.unsubscribeObservables)
                                        .subscribe((res) => {
                                            res.onloadend = () => {
                                                doctor.picUrl = res.result;
                                                this.ref.detectChanges();
                                            };
                                        });
                                } else {
                                    this.chatService.downloadFile('doc.png')
                                    .takeUntil(this.unsubscribeObservables)
                                        .subscribe((res: any) => {
                                            res.onloadend = () => {
                                                doctor.picUrl = res.result;
                                                this.ref.detectChanges();
                                            };
                                        });
                                }
                            });
                        }
                    }
                });
        } else {
            this.router.navigate([`/`]);
        }
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
                qualifications += stores[i].value;
            }
            if (stores[i].type === 'Language' && stores[i].userId === doctorId) {
                languages += stores[i].value;
            }
            if (stores[i].type === 'Consultation mode' && stores[i].userId === doctorId) {
                consultationModes += stores[i].value;
            }
            if (stores[i].type === 'Location' && stores[i].userId === doctorId) {
                locations += stores[i].value;
            }
        }

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

    consultNow(doctor:any) {
        let user = JSON.parse(this.securityService.getCookie('userDetails'));
        // this.sharedService.consultNow(doctorId, user.id)
        //     .subscribe((res) => {
        //         console.log('doctors list component consult now ', res);
        //         if (res) {
        //             this.sharedService.setGroup(res);
        //             setTimeout(() => {
        //                 this.router.navigate([`/chat/${user.id}`]);
        //             }, 500);
        //         } else {
        //             this.message = 'There was an error. Please re-login and try again.';
        //         }
        //     });
        this.socketService.emitConsultNow(user, doctor.userId, `${doctor.firstName} ${doctor.lastName}`);
    }

    receiveConsultNow(user:any) {
        this.socketService.receiveConsultNow()
        .takeUntil(this.unsubscribeObservables)
        .subscribe((res:any)=> {
            if(res[0]==='chat') {
                this.router.navigate([`/chat/${user.id}`]);
            } else if (res[0]==='billing') {
                this.router.navigate([`/payments/${user.id}?bill_id=${res[1]}`]);
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
