import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DragScrollDirective } from 'ngx-drag-scroll';
import { UserDetails } from '../shared/database/user-details';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';
import { ChatService } from '../chat/chat.service';
import { SharedService } from '../shared/services/shared.service';

export interface Files {
    type: string;
    url: string;
}
/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-view-profile',
    templateUrl: 'doctor-view-profile.component.html',
    styleUrls: ['doctor-view-profile.component.css']
})
export class DoctorViewProfileComponent implements OnInit {

    item: Files = { url: './assets/img/luke.png', type: 'image' };
    imagelist: Files[] = [
        { url: './assets/img/luke.png', type: 'image' },
        { url: './assets/img/boba.png', type: 'image' },
        { url: 'https://img.youtube.com/vi/2vjPBrBU-TM/0.jpg', type: 'video' },
        { url: './assets/img/c3po.png', type: 'image' },
        { url: './assets/img/obi.png', type: 'image' },
        { url: 'https://img.youtube.com/vi/2Vv-BfVoq4g/0.jpg', type: 'video' },
        { url: './assets/img/r2d2.png', type: 'image' },
        { url: './assets/img/yolo.png', type: 'image' },
        { url: 'https://img.youtube.com/vi/YykjpeuMNEk/0.jpg', type: 'video' }
    ];
    leftNavDisabled = false;
    rightNavDisabled = false;
    dragScroll: DragScrollDirective;
    userId: number;
    doctorId: number;
    selectedUser: UserDetails;
    doctor: DoctorProfiles;
    qualifications: string = '';
    languages: string = '';
    consultationModes: string = '';
    locations: string = '';
    professionalSociety: string = '';
    doctorSchedule: any;
    doctorActivities: any;
    doctorReviews: any;
    message: string;
    slots: string = '';
    @ViewChild('nav', { read: DragScrollDirective }) ds: DragScrollDirective;
    @Input() user: UserDetails;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('modal') modal: ElementRef;

    constructor(
        private securityService: SecurityService,
        private chatService: ChatService,
        private sharedService: SharedService,
        private router: Router,
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.doctorId = +this.route.snapshot.paramMap.get('id');// this is will give doctorId
        const cookie = this.securityService.getCookie('userDetails'); //return logged in user
        this.userId = JSON.parse(cookie).id;
        this.chatService.getUserById(this.doctorId)
            .subscribe(user => {
                this.selectedUser = user;
                this.sharedService.getDoctorById(this.doctorId)
                    .subscribe(doctor => {
                        this.doctor = doctor;
                        let date = new Date(this.doctor.validity);
                        this.doctor.validity = date.getUTCDay() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear();
                        this.getPicUrl(this.doctor, this.selectedUser);
                        this.getStatus(this.doctor);
                    });
            });
        this.getDoctorStore(this.doctorId);
        this.getActivities(this.doctorId);
        this.getReviews(this.doctorId);
    }

    openModal() {
        this.modal.nativeElement.style.display = 'block';
    }

    closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }

    getDoctorStore(doctorId: number) {
        this.sharedService.getDoctorStore(doctorId)
            .subscribe(doctorStore => {
                this.getStores(doctorStore, doctorId);
            });
    }

    getActivities(doctorId: number) {
        this.sharedService.getActivities(doctorId)
            .subscribe(res => {
                this.doctorActivities = res;
            });
    }

    getReviews(doctorId: number) {
        this.sharedService.getReviews(doctorId)
            .subscribe(res => {
                this.doctorReviews = res;
            });
    }

    getPicUrl(doctor: any, selectedUser: UserDetails) {
        if (selectedUser.picUrl) {
            this.chatService.downloadFile(selectedUser.picUrl)
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
    }

    getStores(stores: any, doctorId: number) {
        this.qualifications = '';
        this.languages = '';
        this.consultationModes = '';
        this.locations = '';
        this.professionalSociety = '';
        for (let i = 0; i < stores.length; i++) {
            if (stores[i].type === 'Qualification' && stores[i].userId === doctorId) {
                this.qualifications = this.qualifications + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Language' && stores[i].userId === doctorId) {
                this.languages = this.languages + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Consultation mode' && stores[i].userId === doctorId) {
                this.consultationModes = this.consultationModes + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Location' && stores[i].userId === doctorId) {
                this.locations = this.locations + ` ${stores[i].value}` + ',';
            }
            if (stores[i].type === 'Professional Society' && stores[i].userId === doctorId) {
                this.professionalSociety = this.professionalSociety + ` ${stores[i].value}` + ',';
            }
        }
        this.qualifications = this.qualifications.slice(0, this.qualifications.length - 1);
        this.languages = this.languages.slice(0, this.languages.length - 1);
        this.consultationModes = this.consultationModes.slice(0, this.consultationModes.length - 1);
        this.locations = this.locations.slice(0, this.locations.length - 1);
        this.professionalSociety = this.professionalSociety.slice(0, this.professionalSociety.length - 1);
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

    getStatus(doctor: any) {
        this.sharedService.getDoctorScheduleByDoctorId(this.doctorId)
            .subscribe(res => {
                this.doctorSchedule = res;
                this.doctor.status = this.doctorSchedule[this.doctorSchedule.length - 1].status;
                this.getSlots(this.doctorSchedule);
            });
    }

    getSlots(doctorSchedules: any) {
        this.slots = '';
        for (let i = 0; i < doctorSchedules.length; i++) {
            let startTime = new Date(doctorSchedules[i].startTime).getUTCHours();
            let ampm = startTime >= 12 ? 'pm' : 'am';
            startTime = startTime % 12;
            startTime = startTime ? startTime : 12;// the hour '0' should be '12'
            let initial = startTime + ampm;

            let endTime = new Date(doctorSchedules[i].endTime).getUTCHours();
            ampm = endTime >= 12 ? 'pm' : 'am';
            endTime = endTime % 12;
            endTime = endTime ? endTime : 12;// the hour '0' should be '12'
            let end = endTime + ampm;
            this.slots = this.slots + ' ' + initial + ' - ' + end + ',';
        }
        this.slots = this.slots.slice(0, this.slots.length - 1);
    }

    clickItem(item: any) {
        if (item.type === 'video') {
            let id = item.url.split('/');
            this.item.type = 'video';
            this.item.url = `https://www.youtube.com/embed/${id[4]}`;
        } else {
            this.item = item;
        }
    }

    moveLeft() {
        this.ds.moveLeft();
    }

    moveRight() {
        this.ds.moveRight();
    }

    leftBoundStat(reachesLeftBound: boolean) {
        this.leftNavDisabled = reachesLeftBound;
    }

    rightBoundStat(reachesRightBound: boolean) {
        this.rightNavDisabled = reachesRightBound;
    }
}
