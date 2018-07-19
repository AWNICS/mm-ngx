import { Component, ViewChild, ChangeDetectorRef, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { SecurityService } from '../shared/services/security.service';
import { SocketService } from '../chat/socket.service';
import { UserDetails } from '../shared/database/user-details';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { ChatService } from '../chat/chat.service';
const Chart = require('chart.js/dist/Chart.bundle.js');

@Component({
    moduleId: module.id,
    selector: 'mm-doctor-dashboard',
    templateUrl: 'doctor-dashboard.component.html',
    styleUrls: ['doctor-dashboard.component.css']
})

export class DoctorDashboardComponent implements OnInit {

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

    constructor(
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private domSanitizer: DomSanitizer,
        private sharedService: SharedService,
        private securityService: SecurityService,
        private socketService: SocketService,
        private chatService: ChatService,
        private router: Router
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.chart();
        const cookie = this.securityService.getCookie('userDetails');
        this.doctorId = +this.route.snapshot.paramMap.get('id');// this is will give doctorId
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else if (JSON.parse(cookie).id) {
            this.userId = JSON.parse(cookie).id;
            this.chatService.getUserById(this.doctorId)
                .subscribe(user => {
                    this.selectedUser = user;
                    if (this.selectedUser.picUrl) {
                        this.downloadPic(this.selectedUser.picUrl);
                    } else {
                        this.downloadAltPic(this.selectedUser.role);
                    }
                });
            this.getDoctorById(this.doctorId);
            this.getDoctorStore(this.doctorId);
        }
        this.socketService.connection(this.userId);
        this.doctorSchedule = { 'status': 'online' };
    }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
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
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = this.domSanitizer.bypassSecurityTrustUrl(res.result);
                    this.ref.detectChanges();
                };
            });
    }

    chart() {
        var ctx = this.barChart.nativeElement.getContext('2d');
        var horizontalBarChartData = {
            labels: ['9am', '10am', '11am', '12am', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm'],
            datasets: [{
                label: 'Follow Ups',
                backgroundColor: '#9690FD',
                data: [3, 2, 4, 2, 0, 0, 1, 1, 0, 4, 1, 3, 2]
            }, {
                label: 'New Patients',
                backgroundColor: '#C4C1FF',
                data: [2, 1, 3, 1, 0, 0, 2, 3, 0, 2, 3, 0, 1]
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
                }
            }
        });
    }
    getDoctorById(doctorId: number) {
        this.sharedService.getDoctorById(doctorId)
            .subscribe(doctor => {
                this.doctor = doctor;
            });
    }
    getDoctorStore(doctorId: number) {
        this.sharedService.getDoctorStore(doctorId)
            .subscribe(doctorStore => {
                this.getStores(doctorStore, doctorId);
            });
    }

    //update status in doctor schedule
    updateStatus(status: string) {
        this.sharedService.updateStatus(status, this.doctorId)
            .subscribe(res => {
                this.doctorSchedule.status = status;
            });
    }

    getStores(stores: any, doctorId: number) {
        this.qualifications = '';
        this.languages = '';
        this.consultationModes = '';
        this.locations = '';
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
        }
        this.qualifications = this.qualifications.slice(0, this.qualifications.length - 1);
        this.languages = this.languages.slice(0, this.languages.length - 1);
        this.consultationModes = this.consultationModes.slice(0, this.consultationModes.length - 1);
        this.locations = this.locations.slice(0, this.locations.length - 1);
    }
}
