import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';

@Component({
    moduleId: module.id,
    selector: 'mm-payment',
    templateUrl: 'payment.component.html',
    styleUrls: ['payment.component.css']
})

export class PaymentComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    userDetails: any;
    response:any;
    visitorId: number;
    bills: any[] = [];

    constructor(
        private service: SharedService,
        private route: ActivatedRoute,
        private router: Router,
        private securityService: SecurityService,
        private sharedService: SharedService
        ) {}

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.visitorId = +this.route.snapshot.paramMap.get('id');// this will give the visitor id
        const cookie = this.securityService.getCookie('userDetails');
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            this.getBills();
        }
        this.userDetails = {
            merchantId: '192155',
            orderId: '1',
            currency: 'INR',
            amount: '1.00',
            redirectUrl: 'http://127.0.0.1:3000/payments/responses',
            cancelUrl: 'http://127.0.0.1:3000/payments/responses',
            integrationType: 'iframe_normal',
            language: 'en'
        };
    }

    paymentGatewayCall() {
        this.service.paymentGatewayCall(this.userDetails)
        .subscribe((res:any) => {
            this.response = res._body;
        });
    }

    getBills() {
        this.sharedService.getBills(this.visitorId)
            .subscribe((billings) => {
                this.bills = billings;
            });
    }
}
