import { Component, OnInit, Input, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DragScrollDirective } from 'ngx-drag-scroll';
import { UserDetails } from '../shared/database/user-details';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { SharedService } from '../shared/services/shared.service';
import { ProfileService } from './profile.service';
import { DoctorMedia } from '../shared/database/doctor-media';
import { Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { takeUntil } from 'rxjs/operators';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-doctor-view-profile',
    templateUrl: 'doctor-view-profile.component.html',
    styleUrls: ['doctor-view-profile.component.css']
})
export class DoctorViewProfileComponent implements OnInit, AfterViewInit, OnDestroy {

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
    mediaFiles: any = [];
    // [{
    //     id: null,
    //     title: null,
    //     description: null,
    //     url: null,
    //     thumbUrl: null,
    //     userId: null,
    //     type: null,
    //     createdBy: null,
    //     updatedBy: null,
    //     createdAt: null,
    //     updatedAt: null
    // }];
    doctorSelected: any;
    leftNavDisabled = false;
    rightNavDisabled = false;
    dragScroll: DragScrollDirective;
    userId: number;
    doctorId: number;
    selectedUser: UserDetails;
    doctor: any;
    // recheck the above type timebeing typecasted
    qualifications = '';
    languages = '';
    consultationModes = '';
    locations = '';
    professionalSociety = '';
    doctorSchedule: any;
    doctorActivities: any = [];
    doctorReviews: any;
    message: string;
    slots = '';
    fullImageUrl;
    videoUrl;
    @ViewChild('nav', { read: DragScrollDirective }) ds: DragScrollDirective;
    @Input() user: UserDetails;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('modal') modal: any;
    @ViewChild('modal1') modal1: any;
    @ViewChild('video') video: any;
    @ViewChild('videoPlayer') videoPlayer: ElementRef;
    private unsubscribeObservables = new Subject();

    constructor(
        private securityService: SecurityService,
        private chatService: ChatService,
        private sharedService: SharedService,
        private socketService: SocketService,
        private router: Router,
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private profileService: ProfileService
    ) { }

    ngOnInit() {
        // this.navbarComponent.navbarColor(0, '#6960FF');
        this.doctorId = +this.route.snapshot.paramMap.get('id'); // this is will give doctorId
        const cookie = this.securityService.getCookie('userDetails'); // return logged in user
        this.userId = JSON.parse(cookie).id;
        this.chatService.getUserById(this.doctorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(user => {
                this.selectedUser = user;
                this.sharedService.getDoctorById(this.doctorId)
                    .pipe(takeUntil(this.unsubscribeObservables))
                    .subscribe(doctor => {
                        this.doctor = doctor;
                        console.log(this.doctor);
                        this.doctor.speciality = doctor.doctorDetails.speciality;
                        const date = new Date(this.doctor.validity);
                        this.doctor.validity = date.getUTCDay() + '-' + date.getUTCMonth() + '-' + date.getUTCFullYear();
                        this.getPicUrl(this.doctor, this.selectedUser);
                        this.getStatus(this.doctor);
                    });
            });
            console.log(cookie);
        this.getDoctorStore(this.doctorId);
        // this.getActivities(this.doctorId);
        // this.getReviews(this.doctorId);
        // this.getDoctorMedia();
        this.receiveConsultNow(JSON.parse(cookie));
    }
    ngAfterViewInit(): void {
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }
    carousel(){
        const win: any = window;
        win.$(document).ready(function(){
          win.$('.owl-carousel').owlCarousel({
            loop: true,
            margin: 10,
            items: 3,
            dots: false,
            // autoWidth: true,
            // autoHeight: true,
            // center: true
            // nav: false
            autoplay: true,
            autoplayTimeout : 4000,
            responsive : {
              300 : {
                items: 2,
                margin: 10
              },
              620 : {
                items: 3,
                margin: 20
              }
          }
          });
        });
      }
    getDoctorMedia() {
        console.log(this.mediaFiles);
        if (this.mediaFiles.length === 0) {
            this.profileService.getLimitedDoctorMedia(this.doctorId, 1, 5)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                console.log(res);
                this.mediaFiles = res;
                this.carousel();
            });
        }
    }

    openVideo(url){
        this.videoUrl = null;
        this.modal1.nativeElement.style.display = 'block';
        this.chatService.downloadFile(url)
        .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.onloadend = () => {
                    this.videoUrl = this.sanitizer.bypassSecurityTrustUrl(res.result);
                    this.ref.detectChanges();
                    this.video.nativeElement.style.display = 'block';
                    this.video.nativeElement.load();
                    this.video.nativeElement.play();
                    // this.video.nativeElement.addEventListener('fullscreenchange', ()=> {
                    //     if(!document.fullscreenElement){
                    //         this.video.nativeElement.pause();
                    //         this.video.nativeElement.style.display = 'none';
                    //     }
                    // })
                    this.video.nativeElement.onended = () =>{
                        this.video.nativeElement.style.display = 'none';
                        this.modal1.nativeElement.style.display = 'none';
                        // document.exitFullscreen();
                    }
                    // this.ref.markForCheck();
                };
            });
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
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(doctorStore => {
                this.getStores(doctorStore, doctorId);
            });
    }

    getActivities(doctorId: number) {
        if(this.doctorActivities.length === 0) {
            this.sharedService.getActivities(doctorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                this.doctorActivities = res;
                this.doctorActivities.map((activity, index) => {
                    if (activity.mediaUrl) {
                        this.downloadPic(activity.mediaUrl, index,'activity');
                    }
                })
            });
        }
    }

    getReviews(doctorId: number) {
        this.sharedService.getReviews(doctorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                this.doctorReviews = res;
            });
    }

    getPicUrl(doctor: any, selectedUser: UserDetails) {
        if (selectedUser.picUrl) {
            this.chatService.downloadFile(selectedUser.picUrl)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((res) => {
                    res.onloadend = () => {
                        doctor.picUrl = res.result;
                    };
                });
            this.ref.detectChanges();
        } else {
            this.chatService.downloadFile('doc.png')
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((res: any) => {
                    res.onloadend = () => {
                        doctor.picUrl = res.result;
                    };
                });
            this.ref.detectChanges();
        }
    }

    getStores(stores: any, doctorId: number) {
        console.log(stores);
        this.qualifications = '';
        this.languages = '';
        this.consultationModes = '';
        this.locations = '';
        this.professionalSociety = '';
        for (let i = 0; i < stores.length; i++) {
            if (stores[i].type === 'Qualification' && stores[i].userId === doctorId) {
                    this.qualifications += stores[i].value;
            }
            if (stores[i].type === 'Language' && stores[i].userId === doctorId) {
                    this.languages += stores[i].value;
            }
            if (stores[i].type === 'Consultation mode' && stores[i].userId === doctorId) {
                    this.consultationModes += stores[i].value;
            }
            if (stores[i].type === 'Location' && stores[i].userId === doctorId) {
                    this.locations += stores[i].value;
            }
            if (stores[i].type === 'Professional Society' && stores[i].userId === doctorId) {
                this.professionalSociety += stores[i].value;
            }
        }
    }

    // consultNow(doctorId: number) {
    //     const user = JSON.parse(this.securityService.getCookie('userDetails'));
    //     this.sharedService.consultNow(doctorId, user.id)
    //         .pipe(takeUntil(this.unsubscribeObservables))
    //         .subscribe((res) => {
    //             if (res) {
    //                 this.sharedService.setGroup(res);
    //                 setTimeout(() => {
    //                     this.router.navigate([`/chat/${user.id}`]);
    //                 }, 500);
    //             } else {
    //                 this.message = 'There was an error. Please re-login and try again.';
    //             }
    //         });
    // }
    openModal(image){
        this.fullImageUrl = '';
        this.modal.nativeElement.style.display = 'block';
        this.downloadPic(image.replace('-thumb', ''), 0, 'modal');
    }

    closeModal() {
        this.modal.nativeElement.style.display = 'none';
        this.modal1.nativeElement.style.display = 'none';
        this.fullImageUrl = '';
        if(this.video){
        this.video.nativeElement.pause();
        this.video.nativeElement.style.display = 'none';
        }
    }

    getStatus(doctor: any) {
        this.sharedService.getDoctorScheduleByDoctorId(doctor.doctorDetails.userId)
            .pipe(takeUntil(this.unsubscribeObservables))
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
            startTime = startTime ? startTime : 12; // the hour '0' should be '12'
            const initial = startTime + ampm;

            let endTime = new Date(doctorSchedules[i].endTime).getUTCHours();
            ampm = endTime >= 12 ? 'pm' : 'am';
            endTime = endTime % 12;
            endTime = endTime ? endTime : 12; // the hour '0' should be '12'
            const end = endTime + ampm;
            this.slots = this.slots + ' ' + initial + ' - ' + end + ',';
        }
        this.slots = this.slots.slice(0, this.slots.length - 1);
    }

     downloadPic(filename: string, index = 0, param = 'none'): any {
         if(param === 'modal'){
            this.chatService.downloadFile(filename)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                 res.onloadend = () => {
                    this.fullImageUrl =  res.result;
                    // this.doctorActivities[index].mediaUrl = res.result;
                };
            });
         }if(param === 'modal'){
            this.chatService.downloadFile(filename)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                 res.onloadend = () => {
                    this.fullImageUrl =  res.result;
                    // this.doctorActivities[index].mediaUrl = res.result;
                };
            });
         } else if (param === 'activity'){
            this.chatService.downloadFile(filename)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                 res.onloadend = () => {
                    this.doctorActivities[index].mediaUrl = res.result;
                };
            });
         }
    }

    consultNow() {
        const user = JSON.parse(this.securityService.getCookie('userDetails'));
        this.router.navigate(['doctors']);
        // console.log(this.doctor);/
        // const speciality = this.sharedService.getSpeciality();
        // console.log('speciality: ' + speciality);
        // this.doctorSelected = doctor.userId;
        // this.socketService.emitConsultNow(user, doctor.doctorDetails.userId,
        //      `${this.selectedUser.firstname} ${this.selectedUser.lastname}`, speciality);
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
                // this.doctors.map((doctor: any) => {
                    // if (doctor.userId === this.doctorSelected) {
                        // this.doctor.availability = 'Busy';
                        // this.doctor.status = 'Busy';
                        // this.doctorSelected = null;
                    // }
                // });
            } else if (res[0] === 'Offline') {
                // this.doctors.map((doctor: any) => {
                    // if (doctor.userId === this.doctorSelected) {
                        // this.doctor.availability = 'Offline';
                        // this.doctor.status = 'Offline';
                        // this.doctorSelected = null;
                    // }
                // });
            }
        });
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
