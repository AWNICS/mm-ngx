import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { UserDetails } from '../shared/database/user-details';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';

@Component({
    moduleId: module.id,
    selector: 'mm-report',
    templateUrl: 'report.component.html',
    styleUrls: ['report.component.css']
})

export class ReportComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    userId: number;
    reportId: number;
    selectedUser: UserDetails;
    report: any;
    url: SafeResourceUrl;

    constructor(
        private route: ActivatedRoute,
        private securityService: SecurityService,
        private sharedService: SharedService,
        private chatService: ChatService,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.userId = +this.route.snapshot.paramMap.get('visitorId');// this is will give visitorId
        this.reportId = this.route.snapshot.queryParams.reportId; // report id
        if (this.securityService.getCookie('userDetails')) {
            this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        }
        this.getReport();
    }

    //get the details of the report
    getReport() {
        this.sharedService.getReportById(this.reportId)
            .subscribe((report: any) => {
                console.log('report: ' + JSON.stringify(report));
                this.report = report;
                this.downloadDoc();
            });
    }

    downloadDoc() {
        this.chatService.downloadFile(this.report.url)
            .subscribe((res) => {
                res.onloadend = () => {
                    //event.srcElement.href = res.result;
                    //event.srcElement.click();
                    //event.srcElement.removeAttribute('href');
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                };
            });
    }
}
