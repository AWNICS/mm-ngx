import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { UserDetails } from '../shared/database/user-details';
import { SharedService } from '../shared/services/shared.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as Chart from 'chart.js';


@Component({
    selector: 'app-patient-dashboard',
    templateUrl: 'patient-dashboard.component.html',
    styleUrls: ['patient-dashboard.component.css']
})

export class PatientDashboardComponent implements OnInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('lineChart') lineChart: ElementRef;
    visitorId: number;
    selectedUser: UserDetails;
    visitorDetail: any;
    languages = '';
    locations = '';
    visitorReport: any;
    visitorHealth: any;
    picUrl: string;
    visitorTimelines: any;
    hideVisitorReports = false;
    hideTimeline = false;
    private unsubscribeObservables = new Subject();

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private router: Router,
        private chatService: ChatService,
        private socketService: SocketService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        console.log(this.securityService);
        // this.navbarComponent.navbarColor(0, '#6960FF');
        this.visitorId = +this.route.snapshot.paramMap.get('id'); // this will give the visitor id
        const cookie = this.securityService.getCookie('userDetails');
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            const userInfo = JSON.parse(cookie);
            console.log(userInfo);
            if (window.localStorage.getItem('pageReloaded')) {
                this.socketService.connection(userInfo.id);
              }
            this.chatService.getUserById(this.visitorId)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((user: any) => {
                    console.log(user);
                    this.selectedUser = user;
                    if (this.selectedUser.picUrl) {
                        this.downloadPic(this.selectedUser.picUrl);
                    } else {
                        this.downloadAltPic(this.selectedUser.role);
                    }
                });
            this.getVisitor(this.visitorId);
            this.getVisitorStore(this.visitorId);
            this.getVisitorAppointmentHistory(this.visitorId);
            this.getVisitorReport(this.visitorId);
            this.getVisitorHealth(this.visitorId);
            this.getTimeline(this.visitorId);
        }
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
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
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.detectChanges();
                };
            });
    }

    chart(consultations: any, reports: any, vitals: any) {
        const ctx = this.lineChart.nativeElement.getContext('2d');
        const barChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Consultations',
                    backgroundColor: '#4B8AF4',
                    radius: 6,
                    fill: false,
                    data: consultations,
                    showLine: false
                }, {
                    label: 'Reports',
                    backgroundColor: '#D0CEFD',
                    radius: 5,
                    fill: false,
                    data: reports,
                    showLine: false
                }, {
                    label: 'Vitals',
                    backgroundColor: '#FDC2CC',
                    radius: 4,
                    fill: false,
                    data: vitals,
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                tooltips: {
                    mode: 'index',
                },
                hover: {
                    mode: 'index'
                },

                scales: {
                    xAxes: [{
                        gridLines: {
                            display: false
                        }
                    }],
                    yAxes: [{
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            fixedStepSize: 1,
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
    }

    getVisitor(visitorId: number) {
        this.sharedService.getVisitor(visitorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(visitor => {
                this.visitorDetail = visitor.patientInfo;
            });
    }

    getVisitorStore(visitorId: number) {
        this.sharedService.getVisitorStore(visitorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(visitorStore => {
                this.getStores(visitorStore, visitorId);
            });
    }

    getStores(visitorStores: any, visitorId: number) {
        this.languages = '';
        this.locations = '';
        for (let i = 0; i < visitorStores.length; i++) {
            if (visitorStores[i].type === 'Language' && visitorStores[i].visitorId === visitorId) {
                    this.languages += visitorStores[i].value;
            }
            if (visitorStores[i].type === 'Location' && visitorStores[i].visitorId === visitorId) {
                    this.locations += visitorStores[i].value;
            }
        }
    }

    getVisitorReport(visitorId: number) {
        this.sharedService.getVisitorReport(visitorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(visitorReport => {
                this.visitorReport = visitorReport;
                if (visitorReport.length === 0) {
                    this.hideVisitorReports = true;
                }
            });
    }

    getVisitorHealth(visitorId: number) {
        this.sharedService.getVisitorHealth(visitorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(visitorHealth => {
                this.visitorHealth = visitorHealth[0];
            });
    }

    /* for plotting the consultation history(consultations, reports and vitals) */
    getVisitorAppointmentHistory(visitorId: number) {
        this.sharedService.getVisitorAppointmentHistory(visitorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(visitorAppointmentHistory => {
                const consultations = visitorAppointmentHistory.consultations.monthly;
                const reports = visitorAppointmentHistory.reports.monthly;
                const vitals = visitorAppointmentHistory.vitals.monthly;
                if (visitorAppointmentHistory) {
                    this.chart(consultations, reports, vitals);
                }
            });
    }

    /* get timeline related info */
    getTimeline(visitorId: number) {
        this.sharedService.getTimeline(visitorId)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(visitorTimeline => {
                if (visitorTimeline.length === 0) {
                    this.hideTimeline = true;
                } else {
                    this.visitorTimelines = visitorTimeline;
                }
            });
    }

    edit() {
        this.router.navigate([`/profiles/${this.selectedUser.id}`]);
    }

    // redirect to particular report details
    reportDetail(report: any) {
        this.router.navigate(['visitors', `${report.visitorId}`], {
            queryParams: {'reportId': `${report.id}`}
        });
    }
}
