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
const Chart = require('chart.js/dist/Chart.bundle.js');
import { Subject } from 'rxjs/Subject';

var moment = require('moment');

@Component({
    moduleId: module.id,
    selector: 'mm-doctor-dashboard',
    templateUrl: 'doctor-dashboard.component.html',
    styleUrls: ['doctor-dashboard.component.css']
})

export class DoctorDashboardComponent implements OnInit, AfterViewInit ,OnDestroy {

    userId: number;
    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('barChart') barChart: ElementRef;
    status: Array<Object> = ['online', 'offline', 'away', 'invisible'];
    selectedStatus: string;
    selectedUser: UserDetails;
    doctor: DoctorProfiles;
    doctorStore: any;
    doctorSchedule: any;
    qualifications: string = '';
    languages: string = '';
    consultationModes: string = '';
    locations: string = '';
    doctorId: number;
    picUrl: SafeResourceUrl;
    consultations: any[] = [];
    patients: number;
    hideConsultations = false;
    earning: number;
    private unsubscribeObservables:any = new Subject();

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private sharedService: SharedService,
        private securityService: SecurityService,
        private chatService: ChatService,
        private socketService: SocketService,
        private router: Router
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        }
        this.doctorId = +this.route.snapshot.paramMap.get('id');// this is will give doctorId
        this.getConsultations(this.doctorId);
        if (!this.selectedUser) {
            this.router.navigate([`/login`]);
        } else {
            this.userId = this.selectedUser.id;
            if(window.localStorage.getItem('pageReloaded')) {
                this.socketService.connection(this.userId);
              }
            if (this.selectedUser.picUrl) {
                this.downloadPic(this.selectedUser.picUrl);
            } else {
                this.downloadAltPic(this.selectedUser.role);
            }
            this.getDoctorSchedule();
            this.getDoctorById(this.doctorId);
            this.getDoctorStore(this.doctorId);
            this.receiveDoctorStatus();
        }
        this.getConsutationDetails('today');
    }

  ngAfterViewInit() {
      this.notificationRequest();
  }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    notificationRequest() {
        let webNotification = (window as any).Notification;
        if (!webNotification) {
            console.warn('Desktop notifications not available in your browser. Try Chrome.');
            return;
          }
        if(webNotification.permission !== 'granted') {
        webNotification.requestPermission((response:any)=> {
            if(response!=='denied') {
              let notification = new webNotification('Web Notifications Enabled', {
                icon: 'assets/logo/web_notification_logo.png',
                body: 'Hello. You are subscribed to Web Notifications',
              });
              notification.onerror = ()=> {console.log('Error in creating WebNotification');};
            } else {
                console.warn('WebPush notications are Blocked. Try enabling them in browser\'s notification settings');
            }
        });
        }
      }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = this.domSanitizer.bypassSecurityTrustUrl(res.result);
                    this.ref.detectChanges();
                };
            });
    }

    downloadAltPic(role: string) {
        let fileName: string;
        if (role === 'bot') {
            fileName = 'bot.jpg';
        } else if (role === 'doctor') {
            fileName = 'doc.png';
        } else {
            fileName = 'user.png';
        }
        this.chatService.downloadFile(fileName)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = this.domSanitizer.bypassSecurityTrustUrl(res.result);
                    this.ref.detectChanges();
                };
            });
    }

    chart(chartDetails: any) {
        var ctx = this.barChart.nativeElement.getContext('2d');
        var horizontalBarChartData = {
            labels: ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'],
            datasets: [{
                label: 'Follow Ups',
                backgroundColor: '#9690FD',
                data: chartDetails.followUps
            }, {
                label: 'New Patients',
                backgroundColor: '#C4C1FF',
                data: chartDetails.newConsultations
            }]
        };
        var barChart = new Chart(ctx, {
            type: 'horizontalBar',
            data: horizontalBarChartData,
            options: {
                elements: {
                    rectangle: {
                        borderWidth: 1,
                    }
                },
                responsive: true,
                legend: {
                    position: 'right',
                },
                title: {
                    display: false,
                    text: 'Chart.js Horizontal Bar Chart'
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            beginAtZero:true,
                            userCallback: function(label: any) {
                                if (Math.floor(label) === label) {
                                    return label;
                                }
                            }
                        }
                    }]
                }
            }
        });
    }

    getDoctorById(doctorId: number) {
        this.sharedService.getDoctorById(doctorId)
        .takeUntil(this.unsubscribeObservables)
            .subscribe(doctor => {
                this.doctor = doctor.doctorDetails;
            });
    }

    getDoctorStore(doctorId: number) {
        this.sharedService.getDoctorStore(doctorId)
        .takeUntil(this.unsubscribeObservables)
            .subscribe(doctorStore => {
                this.getStores(doctorStore, doctorId);
            });
    }

    getDoctorSchedule() {
        this.sharedService.getDoctorScheduleByDoctorId(this.doctorId)
        .takeUntil(this.unsubscribeObservables)
            .subscribe(doctorSchedule => {
                this.doctorSchedule = doctorSchedule[0];
                this.selectedStatus = this.doctorSchedule.status;
                console.log(this.doctorSchedule);
            });
    }

    //update status in doctor schedule
    updateStatus(status: string) {
        /*this.sharedService.updateStatus(status, this.doctorId)
            .subscribe(res => {
                this.selectedStatus = status;
                this.doctorSchedule.status = status;
            });*/
        this.socketService.doctorStatusUpdate(this.selectedUser.id, status);
    }

    receiveDoctorStatus() {
        this.socketService.receiveDoctorStatus()
        .takeUntil(this.unsubscribeObservables)
        .subscribe((status)=> {
            this.doctorSchedule.status = status;
            this.selectedStatus = status;
        });
    }

    getStores(stores: any, doctorId: number) {
        this.qualifications = '';
        this.languages = '';
        this.consultationModes = '';
        this.locations = '';
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
        }
    }

    getConsultations(doctorId: number) {
        let page = 1;
        let size = 20;
        this.sharedService.getConsultationsByDoctorId(doctorId, page, size)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res) => {
                if (res.visitorAppointments.length === 0) {
                    this.hideConsultations = true;
                } else {
                    this.chart(res.chartDetails);
                    res.visitorAppointments.map((appointment: any) => {
                        appointment.startTime = moment(appointment.startTime);
                        this.consultations.push(appointment);
                    });
                    //this.consultations = res.visitorAppointments;
                }
            });
    }

    //for getting the consultation history
    getConsutationDetails(str: string) {
        this.sharedService.getConsutationDetails(this.doctorId)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res) => {
                if (str === 'today') {
                    this.patients = res.noOfPatients.today;
                    this.earning = res.earning.today;
                } else if (str === 'week') {
                    this.patients = res.noOfPatients.week;
                    this.earning = res.earning.week;
                } else if (str === 'month') {
                    this.patients = res.noOfPatients.month;
                    this.earning = res.earning.month;
                } else {
                    this.patients = 0;
                    this.earning = 0;
                }
            });
    }

    //redirect to particular consultation details
    consultationDetail(consultation: any) {
        this.router.navigate(['consultation',`${consultation.doctorId}`],{
            queryParams: {'consultationId':`${consultation.consultationId}`}
        });
    }
}
