import { Component, OnInit, ViewChild, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { SocketService } from '../chat/socket.service';
import * as moment from 'moment';

@Component({
    selector: 'app-consultation',
    templateUrl: 'consultation.component.html',
    styleUrls: ['consultation.component.css']
})

export class ConsultationComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('doctorDashboardComponent') doctorDashboardComponent: any;
    consultations: any = [];
    events: any = [];
    userId: number;
    message: string;
    toggle = false;
    fileName: string;
    url: SafeResourceUrl;
    toggleFileName: Boolean = false;
    oldId: number;
    newId: number;
    billingFileName: string;
    billFile: Boolean = false;
    billUrl: SafeResourceUrl;
    selectedUser: UserDetails;
    billDownloaded: Boolean = true;
    prescriptionDownloaded: Boolean = true;
    consultationId: any;
    page = 1;
    notquerying: Boolean = true;
    private unsubscribeObservables = new Subject();
    private emptyConsultations: Boolean;

    constructor(
        private route: ActivatedRoute,
        private sharedService: SharedService,
        private chatService: ChatService,
        private sanitizer: DomSanitizer,
        private ref: ChangeDetectorRef,
        private securityService: SecurityService,
        private socketService: SocketService
    ) { }

    ngOnInit() {
        // this.navbarComponent.navbarColor(0, '#6960FF');
        this.userId = +this.route.snapshot.paramMap.get('id');
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
            if (window.localStorage.getItem('pageReloaded') === 'true') {
                console.log('Page Reloaded so making new socket connection');
                this.socketService.connection(this.selectedUser.id);
              }
        }
        this.consultationId = this.route.snapshot.queryParams.consultationId;
        if ( this.consultationId && this.selectedUser.role === 'doctor') {
            this.getConsultationById(parseInt(this.consultationId, 10));
        } else {
        this.getConsultations(this.selectedUser.id, this.page);
        }
    }

    ngAfterViewInit() {
        window.addEventListener('scroll', (event: any) => {
            if (Math.max(event.target.documentElement.scrollTop / (event.target.documentElement.scrollHeight - window.innerHeight) 
            * 100) > 98 && !this.emptyConsultations && this.notquerying) {
            this.page = this.page + 1;
            this.getConsultations(this.selectedUser.id, this.page);
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    downloadDoc(index: number, event: any) {
        if (this.prescriptionDownloaded) {
        this.prescriptionDownloaded = false;
        this.chatService.downloadFile(this.consultations[index].prescription.url)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.onloadend = () => {
                    event.srcElement.href = res.result;
                    event.srcElement.click();
                    event.srcElement.removeAttribute('href');
                    this.prescriptionDownloaded = true;
                };
            });
    }
    }

    downloadBilling(index: number, event: any) {
        if (this.billDownloaded) {
        this.billDownloaded = false;
        this.chatService.downloadFile(this.consultations[index].billing.url)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.onloadend = () => {
                    event.srcElement.href = res.result;
                    event.srcElement.click();
                    event.srcElement.removeAttribute('href');
                    this.billDownloaded = true;
                };
            });
    }
    }

    getConsultations(id: number, page: number) {
        const size = 5;
        this.notquerying = false;
        if (this.selectedUser.role === 'patient') {
            this.sharedService.getConsultationsByVisitorId(id, page, size)
                .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                console.log('No of consultaions received: ' + res.length + ' on page: ' + page);
                if (res.length === 0) {
                    this.consultations.length > 0 ?  this.message = 'There are no more consultations to display' :
                    this.message = 'There are no past consultations to display';
                    this.emptyConsultations = true;
                } else {
                    res.map((consultation: any) => {
                        this.consultations.push(consultation);
                        if (consultation.billing) {
                            // recheck this logic at backend and for doctor success should be displayed and for user all
                        if (consultation.billing.status === 'Success') {
                            if (moment(consultation.billing.createdAt).add(3, 'd').unix() > Date.now()) {
                                    consultation.status = 'active';
                            }
                        }
                    }
                    });
                    this.notquerying = true;
                }
            });
        } else if (this.selectedUser.role === 'doctor') {
            this.sharedService.getAllConsultationsByDoctorId(id, page, size)
                .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                console.log('No of consultaions received: ' + res.length + ' on page: ' + page);
                if (res.length === 0) {
                    this.consultations.length > 0 ?  this.message = 'There are no more consultations to display' :
                    this.message = 'There are no past consultations to display';
                     this.emptyConsultations = true;
                } else {
                    res.map((consultation: any) => {
                        this.consultations.push(consultation);
                    });
                    this.ref.markForCheck();
                    res.map((consultation: any) => {
                        if (consultation.billing) {
                        if (consultation.billing.status === 'Success') {
                            if (moment(consultation.billing.createdAt).add(3, 'd').unix() > Date.now()) {
                                    consultation.status = 'active';
                            }
                        }
                    }
                    });
                }
                this.notquerying = true;
            });
        } else {
            return;
        }
   }
    getConsultationById(consultationId: number) {
        this.sharedService.getConsultationsByConsultationId(consultationId, this.selectedUser.id)
            .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((res: any) => {
            if (res.length > 0) {
                this.consultations = res;
            } else {
                this.message = 'Sorry No consultation exists with that id';
            }
        });
    }

    changeIcon(id: number) {
    const element: any = document.querySelector('.toggle-' + id + ' span' );
    if (element.innerText === 'More') {
        element.innerText = 'Less';
    } else {
        element.innerText = 'More';
    }
    }
}
