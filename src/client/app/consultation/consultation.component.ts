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
    billDownloaded:Boolean = true;
    prescriptionDownloaded:Boolean = true;
    consultationId:any;

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
        this.consultationId = this.route.snapshot.queryParams.consultationId;
        if( this.consultationId && this.selectedUser.role==='doctor') {
            this.getConsultationById(parseInt(this.consultationId));
        } else {
        this.getConsultations(this.selectedUser.id);
        }
    }

    downloadDoc(index:number,event:any) {
        if(this.prescriptionDownloaded) {
            this.prescriptionDownloaded = false;
        // fileName.match(/\d+-\d\d-\d\d-[0-9]{4}T\d\d-\d\d-\d\d-[0-9]{3}\.pd
        // f$/i) ? this.toggleFileName = true : this.toggleFileName = false;
        this.chatService.downloadFile(this.consultations[index].prescription.url)
            .subscribe((res) => {
                res.onloadend = () => {
                    event.srcElement.href = res.result;
                    event.srcElement.click();
                    event.srcElement.removeAttribute('href');
                    this.prescriptionDownloaded = true;
                    // this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                    // this.ref.markForCheck();
                };
            });
    }
    }

    downloadBilling(index:number,event:any) {
        if(this.billDownloaded) {
            this.billDownloaded = false;
            console.log(this.consultations[index].billing.url);
        // fileName.match(/\d+-bill-\d\d-\d\d-[0-9]{4}T\d\d-\d\d-\d\d-[0-9]{3}\.pdf$/i) ? this.billFile = true : this.billFile = false;
        this.chatService.downloadFile(this.consultations[index].billing.url)
            .subscribe((res) => {
                res.onloadend = () => {
                    event.srcElement.href = res.result;
                    event.srcElement.click();
                    event.srcElement.removeAttribute('href');
                    this.billDownloaded = true;
                    // this.billUrl = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                    // this.ref.markForCheck();
                };
            });
    }
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
                    this.consultations  = res;
                    // res.map((consultation: any) => {
                    //     this.consultations.push(consultation);
                    //     this.downloadDoc(consultation.prescription.url);
                    //     this.fileName = consultation.prescription.url;
                    //     this.downloadBilling(consultation.billing.url);
                    //     this.billingFileName = consultation.billing.url;
                    // });
                }
            });
        } else if(this.selectedUser.role === 'doctor') {
            this.sharedService.getAllConsultationsByDoctorId(id, page, size)
            .subscribe((res) => {
                console.log(res);
                if (res.length === 0) {
                    this.message = 'There are no consultations or events to be display';
                } else {
                    this.consultations = res;
                    // res.map((consultation: any) => {
                    //     this.consultations.push(consultation);
                    //     this.downloadDoc(consultation.prescription.url);
                    //     this.fileName = consultation.prescription.url;
                    //     this.downloadBilling(consultation.billing.url);
                    //     this.billingFileName = consultation.billing.url;
                    // });
                }
            });
        } else {
            return;
        }
   }
    getConsultationById(consultationId:number) {
        this.sharedService.getConsultationsByConsultationId(consultationId,this.selectedUser.id)
        .subscribe((res:any)=> {
            if(res.length > 0) {
                this.consultations = res;
            } else {
                this.message = 'Sorry No consultation exist with that id';
            }
        });
    }

    changeIcon(id: number) {
    let element:any = document.querySelector('.toggle-'+id+' span' );
    if(element.innerText=== 'More') {
        element.innerText = 'Less';
    } else {
        element.innerText = 'More';
    }
    }
}
