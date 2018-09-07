import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DragScrollDirective } from 'ngx-drag-scroll';
import { UserDetails } from '../shared/database/user-details';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';
import { ChatService } from '../chat/chat.service';
import { SharedService } from '../shared/services/shared.service';
import { ProfileService } from './profile.service';
import { DoctorMedia } from '../shared/database/doctor-media';

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

    item: DoctorMedia = {
        id: null,
        title: null,
        description: null,
        url: null,
        thumbUrl: null,
        userId: null,
        type: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null
    };
    mediaFiles: DoctorMedia[] = [{
        id: null,
        title: null,
        description: null,
        url: null,
        thumbUrl: null,
        userId: null,
        type: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null
    }];
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
    @ViewChild('videoPlayer') videoPlayer: ElementRef;

    constructor(
        private securityService: SecurityService,
        private chatService: ChatService,
        private sharedService: SharedService,
        private router: Router,
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private profileService: ProfileService
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
                        this.doctor.speciality = doctor.speciality.speciality;
                        let date = new Date(this.doctor.validity);
                        this.doctor.validity = date.getUTCDay() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear();
                        this.getPicUrl(this.doctor, this.selectedUser);
                        this.getStatus(this.doctor);
                    });
            });
        this.getDoctorStore(this.doctorId);
        this.getActivities(this.doctorId);
        this.getReviews(this.doctorId);
        this.getDoctorMedia();
    }

    getDoctorMedia() {
        this.profileService.getLimitedDoctorMedia(this.doctorId, 1, 5)
            .subscribe(res => {
                this.mediaFiles = res;
                this.mediaFiles.map((mediaFile: DoctorMedia, i: number) => {
                    this.chatService.downloadFile(mediaFile.thumbUrl)
                        .subscribe(res => {
                            res.onloadend = () => {
                                this.mediaFiles[i].thumbUrl = res.result;
                            };
                        });
                });
            });
    }

    openModal(file: DoctorMedia) {
        if (file.type === 'image' || file.type === 'video') {
            this.chatService.downloadFile(file.url)
                .subscribe(res => {
                    res.onloadend = () => {
                        this.item.type = file.type;
                        this.item.url = res.result;
                    };
                });
        } else {
            return;
        }
    }

    stopVideo(item: any) {
        if (item.type === 'video') {
            this.videoPlayer.nativeElement.pause();
        } else {
            return;
        }
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
                stores[i].value.qualification.map((qualification:string)=> {
                    this.qualifications += qualification +', ';
                });
            }
            if (stores[i].type === 'Language' && stores[i].userId === doctorId) {
                stores[i].value.language.map((language:string)=> {
                    this.languages += language +', ';
                });
            }
            if (stores[i].type === 'Consultation mode' && stores[i].userId === doctorId) {
                stores[i].value.consultationMode.map((consultationMode:string)=> {
                    this.consultationModes += consultationMode +', ';
                });
            }
            if (stores[i].type === 'Location' && stores[i].userId === doctorId) {
                stores[i].value.location.map((location:string)=> {
                    this.locations += location +', ';
                });
            }
            if (stores[i].type === 'Professional Society' && stores[i].userId === doctorId) {
                this.professionalSociety = this.professionalSociety + ` ${stores[i].value}` + ',';
            }
        }
        this.qualifications = this.qualifications.slice(0, this.qualifications.length - 2);
        this.languages = this.languages.slice(0, this.languages.length - 2);
        this.consultationModes = this.consultationModes.slice(0, this.consultationModes.length - 2);
        this.locations = this.locations.slice(0, this.locations.length - 2);
        this.professionalSociety = this.professionalSociety.slice(0, this.professionalSociety.length - 2);
    }

    consultNow(doctorId: number) {
        let user = JSON.parse(this.securityService.getCookie('userDetails'));
        this.sharedService.consultNow(doctorId, user.id)
            .subscribe((res) => {
                if (res) {
                    this.sharedService.setGroup(res);
                    this.router.navigate([`/chat/${user.id}`]);
                } else {
                    this.message = 'There was an error. Please re-login and try again.';
                }
            });
    }

    getStatus(doctor: any) {
        this.sharedService.getDoctorScheduleByDoctorId(doctor.id)
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
