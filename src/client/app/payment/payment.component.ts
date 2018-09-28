import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Http } from '@angular/http';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
    moduleId: module.id,
    selector: 'mm-payment',
    templateUrl: 'payment.component.html',
    styleUrls: ['payment.component.css']
})

export class PaymentComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    public payuform: any = {};
    disablePaymentButton: boolean = true;

    constructor(private http: Http, private ref: ElementRef) { }

    ngOnInit() {
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    confirmPayment() {
        const paymentPayload = {
            email: this.payuform.email,
            firstname: this.payuform.firstname,
            phone: this.payuform.phone,
            productinfo: this.payuform.productinfo,
            amount: this.payuform.amount,
            txnid: '12345'
        };
        // let requestData: any = {};
        return this.http.post('http://localhost:3000/payments/details', paymentPayload).subscribe(
            (data: any) => {
                let response = JSON.parse(data._body);
                if (JSON.parse(data._body).success) {
                    // appending data to the data object
                    console.log('res ', response.data);
                    this.payuform.txnid = response.data.txnid;
                    this.payuform.surl = response.data.surl;
                    this.payuform.furl = response.data.furl;
                    this.payuform.key = response.data.key;
                    this.payuform.hash = response.data.hash;
                    this.payuform.service_provider = 'payu_paisa';
                    this.disablePaymentButton = false;
                }
            }, error1 => {
                console.log('err1 ', error1);
            });
    }
}
