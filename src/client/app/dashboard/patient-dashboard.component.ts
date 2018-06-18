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
    visitorAppointment: any;
    visitorReport: any;
    visitorHealth: any;
    visitorPrescription: any;

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
        this.chart();
        this.visitorId = +this.route.snapshot.paramMap.get('id');// this will give the visitor id
        const cookie = this.securityService.getCookie('userDetails');
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else if (this.visitorId === JSON.parse(cookie).id) {
            this.chatService.getUserById(this.visitorId)
                .subscribe(user => {
                    this.selectedUser = user;
                });
            this.getVisitor(this.visitorId);
            this.getVisitorStore(this.visitorId);
            this.getVisitorAppointment(this.visitorId);
            this.visitorAppointment = {'status': 'online'};
            this.getVisitorReport(this.visitorId);
            this.getVisitorHealth(this.visitorId);
            this.getVisitorPrescription(this.visitorId);
        }
    }

    chart() {
        var ctx = this.lineChart.nativeElement.getContext('2d');
        var barChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Consultation',
                    backgroundColor: '#4B8AF4',
                    radius: 6,
                    fill: false,
                    data: [1, 2, 1, 0, 0, 1, 0, 0, 2, 1, 0, 1],
                    showLine: false
                }, {
                    label: 'Reports',
                    backgroundColor: '#D0CEFD',
                    radius: 5,
                    fill: false,
                    data: [1, 0, 1, 0, 2, 1, 0, 1, 0, 0, 1, 2],
                    showLine: false
                }, {
                    label: 'Vitals',
                    backgroundColor: '#FDC2CC',
                    radius: 4,
                    fill: false,
                    data: [0, 1, 2, 0, 2, 1, 0, 1, 0, 0, 1, 2],
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
                this.visitorDetail = visitor;
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
                this.languages = this.languages + ` ${visitorStores[i].value}` + ',';
            }
            if (visitorStores[i].type === 'Location' && visitorStores[i].visitorId === visitorId) {
                this.locations = this.locations + ` ${visitorStores[i].value}` + ',';
            }
        }
        this.languages = this.languages.slice(0, this.languages.length - 1);
        this.locations = this.locations.slice(0, this.locations.length - 1);
    }

    getVisitorAppointment(visitorId: number) {
        this.sharedService.getVisitorAppointment(visitorId)
            .subscribe(visitorAppointment => {
                this.visitorAppointment = visitorAppointment;
            });
    }

    getVisitorReport(visitorId: number) {
        this.sharedService.getVisitorReport(visitorId)
            .subscribe(visitorReport => {
                this.visitorReport = visitorReport;
            });
    }

    getVisitorHealth(visitorId: number) {
        this.sharedService.getVisitorHealth(visitorId)
            .subscribe(visitorHealth => {
                this.visitorHealth = visitorHealth;
            });
    }

    getVisitorPrescription(visitorId: number) { 
        this.sharedService.getVisitorPrescription(visitorId)
            .subscribe(visitorPrescription => {
                this.visitorPrescription = visitorPrescription;
            });
    }
}
