import { Component, OnInit, ViewChild } from '@angular/core';
import { NavbarComponent } from '../shared/navbar/navbar.component';
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

    constructor(private service: SharedService) {}

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
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
}
