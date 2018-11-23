import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';

@Component({
    moduleId: module.id,
    selector: 'mm-consultation',
    templateUrl: 'consultation.component.html',
    styleUrls: ['consultation.component.css']
})

export class ConsultationComponent implements OnInit {

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

    constructor(
        private route: ActivatedRoute,
        private sharedService: SharedService,
        private chatService: ChatService,
        private sanitizer: DomSanitizer,
        private ref: ChangeDetectorRef,
        private securityService: SecurityService
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.userId = +this.route.snapshot.paramMap.get('id');// this is will give doctorId
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        }
        this.getConsultations(this.selectedUser.id);
        this.doctorDashboardComponent.container.nativeElement.scrollIntoView();
    }

    downloadDoc(fileName: string) {
        fileName.match(/\d+-\d\d-\d\d-[0-9]{4}T\d\d-\d\d-\d\d-[0-9]{3}\.pdf$/i) ? this.toggleFileName = true : this.toggleFileName = false;
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                    this.ref.markForCheck();
                };
            });
    }

    getConsultations(id: number) {
        let page = 1;
        let size = 5;
        if(this.selectedUser.role === 'patient') {
            this.sharedService.getConsultationsByVisitorId(id, page, size)
            .subscribe((res) => {
                if (res.length === 0) {
                    this.message = 'There are no consultations or events to be display';
                } else {
                    res.map((consultation: any) => {
                        this.consultations.push(consultation);
                        this.downloadDoc(consultation.prescription.url);
                        this.fileName = consultation.prescription.url;
                        this.downloadBilling(consultation.billing.url);
                        this.billingFileName = consultation.billing.url;
                    });
                }
            });
        } else if(this.selectedUser.role === 'doctor') {
            this.sharedService.getAllConsultationsByDoctorId(id, page, size)
            .subscribe((res) => {
                if (res.length === 0) {
                    this.message = 'There are no consultations or events to be display';
                } else {
                    res.map((consultation: any) => {
                        this.consultations.push(consultation);
                        this.downloadDoc(consultation.prescription.url);
                        this.fileName = consultation.prescription.url;
                        this.downloadBilling(consultation.billing.url);
                        this.billingFileName = consultation.billing.url;
                    });
                }
            });
        } else {
            return;
        }
    }

    downloadBilling(fileName: string) {
        fileName.match(/\d+-\d\d-\d\d-[0-9]{4}T\d\d-\d\d-\d\d-[0-9]{3}\.pdf$/i) ? this.billFile = true : this.billFile = false;
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.billUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                    this.ref.markForCheck();
                };
            });
    }

    changeIcon(id: number) {
        if (this.toggle === false) {
            this.toggle = true;
            document.getElementById('toggle-' + id.toString()).innerHTML = 'Less';
        } else {
            this.toggle = false;
            document.getElementById('toggle-' + id.toString()).innerHTML = 'More';
        }
    }
}
