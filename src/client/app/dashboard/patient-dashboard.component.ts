import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { ChatService } from '../chat/chat.service';
import { UserDetails } from '../shared/database/user-details';
import { SharedService } from '../shared/services/shared.service';
const Chart = require('chart.js/dist/Chart.bundle.js');

@Component({
    moduleId: module.id,
    selector: 'mm-patient-dashboard',
    templateUrl: 'patient-dashboard.component.html',
    styleUrls: ['patient-dashboard.component.css']
})

export class PatientDashboardComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('lineChart') lineChart: ElementRef;
    visitorId: number;
    selectedUser: UserDetails;
    visitorDetail: any;
    languages: string = '';
    locations: string = '';
    visitorReport: any;
    visitorHealth: any;
    visitorPrescription: any;
    picUrl: string;
    visitorTimelines: any;
    hideVisitorReports = false;
    hideTimeline = false;

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private router: Router,
        private chatService: ChatService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.visitorId = +this.route.snapshot.paramMap.get('id');// this will give the visitor id
        const cookie = this.securityService.getCookie('userDetails');
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            this.chatService.getUserById(this.visitorId)
                .subscribe(user => {
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
            this.getVisitorPrescription(this.visitorId);
            this.getTimeline(this.visitorId);
        }
    }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
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
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.detectChanges();
                };
            });
    }

    chart(consultations: any, reports: any, vitals: any) {
        var ctx = this.lineChart.nativeElement.getContext('2d');
        var barChart = new Chart(ctx, {
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
                            fixedStepSize: 1
                        }
                    }]
                }
            }
        });
    }

    getVisitor(visitorId: number) {
        this.sharedService.getVisitor(visitorId)
            .subscribe(visitor => {
                this.visitorDetail = visitor.patientInfo;
            });
    }

    getVisitorStore(visitorId: number) {
        this.sharedService.getVisitorStore(visitorId)
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
            .subscribe(visitorReport => {
                this.visitorReport = visitorReport;
                if(visitorReport.length === 0) {
                    this.hideVisitorReports = true;
                }
            });
    }

    getVisitorHealth(visitorId: number) {
        this.sharedService.getVisitorHealth(visitorId)
            .subscribe(visitorHealth => {
                this.visitorHealth = visitorHealth[0];
            });
    }

    getVisitorPrescription(visitorId: number) {
        this.sharedService.getVisitorPrescription(visitorId)
            .subscribe(visitorPrescription => {
                this.visitorPrescription = visitorPrescription[0];
            });
    }

    /* for plotting the consultation history(consultations, reports and vitals) */
    getVisitorAppointmentHistory(visitorId: number) {
        this.sharedService.getVisitorAppointmentHistory(visitorId)
            .subscribe(visitorAppointmentHistory => {
                let consultations = visitorAppointmentHistory.consultations.monthly;
                let reports = visitorAppointmentHistory.reports.monthly;
                let vitals = visitorAppointmentHistory.vitals.monthly;
                if(visitorAppointmentHistory) {
                    this.chart(consultations, reports, vitals);
                }
            });
    }

    /* get timeline related info */
    getTimeline(visitorId: number) {
        this.sharedService.getTimeline(visitorId)
            .subscribe(visitorTimeline => {
                if(visitorTimeline.length === 0) {
                    this.hideTimeline = true;
                } else {
                    this.visitorTimelines = visitorTimeline;
                }
            });
    }

    edit() {
        this.router.navigate([`/profiles/${this.selectedUser.id}`]);
    }
}
