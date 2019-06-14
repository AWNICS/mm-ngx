import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { SecurityService } from '../shared/services/security.service';
import { UserDetails } from '../shared/database/user-details';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
    selector: 'app-doctor-dashboard',
    templateUrl: 'doctor-dashboard.component.html',
    styleUrls: ['doctor-dashboard.component.css']
})

export class DoctorDashboardComponent implements OnInit, AfterViewInit , OnDestroy {

    userId: number;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('barChart') barChart: ElementRef;
    @ViewChild('buttonGroup') buttonGroup: ElementRef;
    status: Array<Object> = ['Online', 'Offline', 'Busy'];
    selectedStatus: string;
    selectedUser: UserDetails;
    doctorDetails: DoctorProfiles;
    doctorStore: any;
    doctorSchedule: any;
    qualifications = '';
    languages = '';
    consultationModes = '';
    locations = '';
    doctorId: number;
    picUrl: SafeResourceUrl;
    consultations: any[] = [];
    patients: number;
    hideConsultations = false;
    earning: number;
    billingAndPatientCount: any = {};
    private unsubscribeObservables: any = new Subject();

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        public sharedService: SharedService,
        private securityService: SecurityService,
        private chatService: ChatService,
        private socketService: SocketService,
        private router: Router
    ) { }

    ngOnInit() {
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        }
        this.doctorId = +this.route.snapshot.paramMap.get('id'); // this is will give doctorId
        this.getConsultations(this.doctorId);
        if (!this.selectedUser) {
            this.router.navigate([`/login`]);
        } else {
            this.userId = this.selectedUser.id;
            if (window.localStorage.getItem('pageReloaded')) {
                this.socketService.connection(this.userId);
              }
            if (this.selectedUser.picUrl) {
                this.downloadPic(this.selectedUser.picUrl, null);
            } else {
                this.downloadAltPic(this.selectedUser.role, null);
            }
            this.getDoctorSchedule();
            this.getDoctorById(this.doctorId);
            this.receiveDoctorStatus();
        }
        this.getBillingAndPatientTotal();
    }

  ngAfterViewInit() {
      this.notificationRequest();
  }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    notificationRequest() {
        const webNotification = (window as any).Notification;
        if (!webNotification) {
            console.warn('Desktop notifications not available in your browser. Try Chrome.');
            return;
          }
        if (webNotification.permission !== 'granted') {
        webNotification.requestPermission((response: any) => {
            if (response !== 'denied') {
              const notification = new webNotification('Web Notifications Enabled', {
                icon: 'assets/logo/web_notification_logo.png',
                body: 'Hello. You are subscribed to Web Notifications',
              });
              notification.onerror = () => {console.log('Error in creating WebNotification'); };
            } else {
                console.warn('WebPush notications are Blocked. Try enabling them in browser\'s notification settings');
            }
        });
        }
      }
      downloadPic(filename: string, index): any {
        this.chatService.downloadFile(filename)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                res.onloadend = () => {
                    if ( index === null ) {
                        this.picUrl = res.result;
                    } else {
                    this.consultations[index].picUrl = res.result;
                    }
                };
            });
    }

    downloadAltPic(role: string, index: number ): any {
        let fileName: string;
        if (role === 'bot') {
            fileName = 'bot.jpg';
        } else if (role === 'doctor') {
            fileName = 'doc.png';
        } else {
            fileName = 'user.png';
        }
        this.chatService.downloadFile(fileName)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                res.onloadend = () => {
                    if ( index === null ) {
                        this.picUrl = res.result;
                    } else {
                    this.consultations[index].picUrl = res.result;
                    }
                };
            });
    }

    getDoctorById(doctorId: number) {
        this.sharedService.getDoctorById(doctorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(doctor => {
                console.log(doctor);
                this.doctorDetails = doctor.doctorDetails;
                this.getStores(doctor.doctorStores, doctorId);
            });
    }

    getDoctorSchedule() {
        this.sharedService.getDoctorScheduleByDoctorId(this.doctorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(doctorSchedule => {
                this.doctorSchedule = doctorSchedule[0];
                this.selectedStatus = this.doctorSchedule.status;
            });
    }

    // update status in doctor schedule
    updateStatus(status: string) {
        this.socketService.doctorStatusUpdate(this.selectedUser.id, status);
    }

    receiveDoctorStatus() {
        this.socketService.receiveDoctorStatus()
            .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((status) => {
            status = status.charAt(0).toUpperCase() + status.substring(1);
            this.doctorSchedule.status = status;
            this.selectedStatus = status;
        });
    }

    getStores(stores: any, doctorId: number) {
        console.log(stores);
        for (let i = 0; i < stores.length; i++) {
            if (stores[i].type === 'Qualification' && stores[i].userId === doctorId) {
                this.qualifications += stores[i].value;
                console.log(this.qualifications);
                this.qualifications.replace(',', ', ');
            }
            if (stores[i].type === 'Consultation mode' && stores[i].userId === doctorId) {
                this.consultationModes += stores[i].value;
                this.consultationModes.replace(',', ', ');
            }
            if (stores[i].type === 'Location' && stores[i].userId === doctorId) {
                this.locations += stores[i].value;
                this.locations.replace(',', ', ');
            }
        }
    }

    getConsultations(doctorId: number) {
        const page = 1;
        const size = 20;
        this.sharedService.getConsultationsByDoctorId(doctorId, page, size)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((consultations) => {
                this.consultations = [];
                this.consultations = consultations;
                this.ref.markForCheck();
                console.log(this.consultations);
                this.consultations.map((consultation: any, index: number) => {
                    consultation.picUrl1 = consultation.picUrl ? this.downloadPic(consultation.picUrl, index)
                    : this.downloadAltPic('user', index);
                });
                });
    }

    // for getting the consultation history
    toggleValues(str: string, srcElement: number) {
    this.buttonGroup.nativeElement.querySelector('.active').className = 'button';
    this.buttonGroup.nativeElement.children[srcElement - 1].className = 'button active';
        if (str === 'today') {
            this.patients = this.billingAndPatientCount.noOfPatients.today;
            this.earning = this.billingAndPatientCount.earning.today;
        } else if (str === 'week') {
            this.patients = this.billingAndPatientCount.noOfPatients.week;
            this.earning = this.billingAndPatientCount.earning.week;
        } else if (str === 'month') {
            this.patients = this.billingAndPatientCount.noOfPatients.month;
            this.earning = this.billingAndPatientCount.earning.month;
        } else {
            this.patients = this.billingAndPatientCount.noOfPatients.year;
            this.earning = this.billingAndPatientCount.earning.year;
        }
    }
    getBillingAndPatientTotal() {
        this.sharedService.getConsutationDetails(this.doctorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                this.patients = res.noOfPatients.today;
                this.earning = res.earning.today;
                this.billingAndPatientCount = res;
            })
    }

    // redirect to particular consultation details
    consultationDetail(consultation: any) {
        this.router.navigate(['consultation', `${consultation.doctorId}`], {
            queryParams: {'consultationId': `${consultation.consultationId}`}
        });
    }
}
