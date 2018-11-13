import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { CookieXSRFStrategy } from '@angular/http';
import { window } from 'rxjs/operator/window';

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
    @ViewChild('paymentModal') paymentModal: ElementRef;
    @ViewChild('dismissButton') dismissButton: ElementRef;

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
        const cookie = JSON.parse(this.securityService.getCookie('userDetails'));
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            this.getBills();
        }
        this.userDetails = `merchant_id=192155&currency=INR&amount=1.00`+
        `&redirect_url=https://mesomeds.com:3000/payments/responses&cancel_url=https://mesomeds.com:3000/payments/responses`+
        `&integration_type=iframe_normal&language=en`+
        `&billing_name=${cookie.firstname+cookie.lastname}&billing_address=Awnicstechnologiespvtltd&billing_city=Bangalore`+
        `&billing_state=Karnataka&billing_zip=560043&billing_country=India&billing_email=${cookie.email}&billing_tel=${cookie.phoneNo}`;
        console.log(this.userDetails);
        document.addEventListener('click',(event:any)=> {
            if(this.paymentModal.nativeElement.style.display ==='block' && event.target.id==='paymentModal') {
                console.log('Dismissed Modal Window');
                this.dismissButton.nativeElement.click();
            }
        });
    }

    paymentGatewayCall(i:number) {
        this.service.paymentGatewayCall(this.userDetails+`&order_id=${this.bills[i].orderId}`)
        .subscribe((res:any) => {
            // let  wind:any = window;
            // let width = wind.innerWidth - 40;
            // let height = (482*638)/width+20;
            // res._body = res._body.replace(/width="\d+"/,`width="${width}"`);
            // res._body = res._body.replace(/height="\d+"/,`height="${height}"`);
            console.log(res._body);
            this.response = res._body;
        });
    }

    getBills() {
        this.sharedService.getBills(this.visitorId)
            .subscribe((billings) => {
                console.log(billings);
                this.bills = billings;
            });
    }
}
