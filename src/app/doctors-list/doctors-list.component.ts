import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { SecurityService } from '../shared/services/security.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-doctors-list',
    templateUrl: 'doctors-list.component.html',
    styleUrls: ['doctors-list.component.css']
})

export class DoctorsListComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    doctors: any = [];
    message: string;
    selectedUser: any;
    doctorSelected: any;
    page: any = 1;
    emptyDoctors: Boolean;
    notQuerying: Boolean = true;
    private unsubscribeObservables: any = new Subject();

    constructor(
        private sharedService: SharedService,
        private chatService: ChatService,
        private socketService: SocketService,
        private ref: ChangeDetectorRef,
        private securityService: SecurityService,
        private router: Router
    ) { }

    ngOnInit() {
        // work here on login status based on cookie
        // console.log(this.securityService.getLoginStatus());
         this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        if (window.localStorage.getItem('pageReloaded')) {
            console.log('Page Reloaded');
            this.socketService.connection(this.selectedUser.id);
        }
        if (this.selectedUser && this.selectedUser.role === 'doctor') {
            this.router.navigate([`/dashboards/doctors/${this.selectedUser.id}`]);
        } else if ( this.selectedUser.role === 'admin') {
            this.router.navigate([`/admin/${this.selectedUser.id}`]);
        } else {
            this.getDoctors();
            this.receiveConsultNow(this.selectedUser);
        }
    }

    ngAfterViewInit() {
        window.addEventListener('scroll', (event: any) => {
            if (Math.max(event.target.documentElement.scrollTop / (event.target.documentElement.scrollHeight - window.innerHeight) 
            * 100) > 98 && !this.emptyDoctors && this.notQuerying) {
            this.page = this.page + 1;
            this.getDoctors();
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    getDoctors() {
        const location = this.sharedService.getLocation();
        const speciality = this.sharedService.getSpeciality();
        const gps = 39834758;
        const currentTime = moment(Date.now()).format();
        const size = 10;
        this.notQuerying = false;
        if (location && speciality) {
            this.sharedService.getDoctors(this.selectedUser.id, location, speciality, gps, currentTime, this.page, size)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    console.log(res);
                    this.notQuerying = true;
                    const pastLength = this.doctors.length;
                        this.doctors.push(...res.doctors);
                        if(this.doctors.length === 0) {
                            this.message = 'There are no doctors available currently. Try again later!';
                        }
                        if (res.doctors.length < 10) {
                            this.emptyDoctors = true;
                        }
                        if (this.doctors.length >= 1) {
                            this.doctors.slice(pastLength, this.doctors.length).map((doctor: any) => {
                                if (res.inactiveGroups.groups.length > 0) {
                                res.inactiveGroups.groups.map((group: any) => {
                                    if (doctor.userId === group.doctorId) {
                                        doctor.message = 'chat';
                                        doctor.group = group.groupId;
                                    }
                                });
                            } else {
                                let count = 0;
                                res.consultations.doctorId.map((doctorId: any) => {
                                    if (doctor.userId === doctorId) {
                                        count++;
                                        count === 1 ? doctor.message = `You had consulted this doctor 1 time` :
                                        doctor.message = `You had consulted this doctor ${count} times`;
                                    }
                                });
                            }
                                doctor.speciality = JSON.parse(doctor.speciality);
                                doctor.qualification = JSON.parse(doctor.qualification);
                                doctor.location = JSON.parse(doctor.location);
                                doctor.consultationMode = JSON.parse(doctor.consultationMode);
                                if (doctor.picUrl) {
                                    this.chatService.downloadFile(doctor.picUrl)
                                        .pipe(takeUntil(this.unsubscribeObservables))
                                        .subscribe((result) => {
                                            result.onloadend = () => {
                                                doctor.picUrl = result.result;
                                                this.ref.detectChanges();
                                            };
                                        });
                                } else {
                                    this.chatService.downloadFile('doc.png')
                                        .pipe(takeUntil(this.unsubscribeObservables))
                                        .subscribe((res1: any) => {
                                            res1.onloadend = () => {
                                                doctor.picUrl = res1.result;
                                                this.ref.detectChanges();
                                            };
                                        });
                                }
                            });
                        }
                    // }
                });
        } else {
            this.router.navigate([`/`]);
        }
    }
    /**
     * doctor stores for all the listed doctors
     * @//param stores
     * @//param doctorId
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

        // iterate the doctors[] array and assign the required variable and use it inside the html
        for (let i = 0; i < this.doctors.length; i++) {
            if (this.doctors[i].userId === doctorId) {
                this.doctors[i].qualificationStr = qualifications;
                this.doctors[i].languageStr = languages;
                this.doctors[i].consultationModeStr = consultationModes;
                this.doctors[i].locationStr = locations;
            }
        }
    }

    consultNow(doctor: any, event: any) {
        const user = JSON.parse(this.securityService.getCookie('userDetails'));
        const speciality = this.sharedService.getSpeciality();
        const location = this.sharedService.getLocation();
        console.log('speciality: ' + speciality);
        this.doctorSelected = doctor.userId;
        this.socketService.emitConsultNow(user, doctor.userId, `${doctor.firstName} ${doctor.lastName}`, speciality, 'Video', location);
    }
    navigate(doctor) {
        console.log(doctor);
        console.log(this.doctors);
        this.sharedService.setSelectedDoctor(doctor);
        this.router.navigate(['/profiles/doctors', doctor.userId]);
    }

    receiveConsultNow(user: any) {
        this.socketService.receiveConsultNow()
            .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((res: any) => {
            console.log(res);
            if (res[0] === 'chat') {
                this.router.navigate([`/chat/${user.id}`]);
            } else if (res[0] === 'billing') {
                this.router.navigate([`/payments/${user.id}`], {
                    queryParams: {'bill_id': `${res[1]}`}
                });
            } else if (res[0] === 'Busy') {
                this.doctors.map((doctor: any) => {
                    if (doctor.userId === this.doctorSelected) {
                        doctor.availability = 'Busy';
                        doctor.status = 'Busy';
                        this.doctorSelected = null;
                    }
                });
            } else if (res[0] === 'Offline') {
                this.doctors.map((doctor: any) => {
                    if (doctor.userId === this.doctorSelected) {
                        doctor.availability = 'Offline';
                        doctor.status = 'Offline';
                        this.doctorSelected = null;
                    }
                });
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
