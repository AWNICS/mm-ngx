import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-payment',
    templateUrl: 'payment.component.html',
    styleUrls: ['payment.component.css']
})

export class PaymentComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    userDetails: any;
    response: any;
    visitorId: number;
    bills: any[] = [];
    @ViewChild('paymentModal') paymentModal: ElementRef;
    @ViewChild('dismissButton') dismissButton: ElementRef;
    @ViewChild('downloadFile') downloadFile: ElementRef;
    selectedUser: any;
    billUrl: SafeResourceUrl;
    billDownloaded: any = true;
    page = 1;
    emptyBills: Boolean;
    noBillWithId: Boolean;
    notquerying: Boolean = true;
    private unsubscribeObservables = new Subject();

    constructor(
        private service: SharedService,
        private route: ActivatedRoute,
        private router: Router,
        private securityService: SecurityService,
        private sharedService: SharedService,
        private chatService: ChatService,
        private socketService: SocketService,
        private ref: ChangeDetectorRef,
        private sanitizer: DomSanitizer
    ) { }

    ngOnInit() {
        // this.navbarComponent.navbarColor(0, '#6960FF');
        this.visitorId = +this.route.snapshot.paramMap.get('id'); // this will give the visitor id
        const cookie = JSON.parse(this.securityService.getCookie('userDetails'));
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            this.selectedUser = cookie;
            if (window.localStorage.getItem('pageReloaded') === 'true') {
                console.log('Page Reloaded');
                this.socketService.connection(this.selectedUser.id);
              }
        const billId = this.route.snapshot.queryParams.bill_id;
        // recheck here the case with billid as null and check if scroll bar in case of get bill by id
        if (billId && billId !== 'null') {
            this.getBillById(billId);
        } else {
            this.getBills(this.page);
        }
        }
        this.userDetails = `merchant_id=192155&currency=INR&amount=1.00` +
            `&redirect_url=https://mesomeds.com:3000/payments/responses&cancel_url=https://mesomeds.com:3000/payments/responses` +
            `&integration_type=iframe_normal&language=en` +
            `&billing_name=${cookie.firstname + cookie.lastname}&billing_address=Awnicstechnologiespvtltd&billing_city=Bangalore` +
            `&billing_state=Karnataka&billing_zip=560043&billing_country=India&billing_email=${cookie.email}&billing_tel=${cookie.phoneNo}`;
        document.addEventListener('click', (event: any) => {
            if (this.paymentModal.nativeElement.style.display === 'block' && event.target.id === 'paymentModal') {
                console.log('Dismissed Modal Window');
                this.dismissButton.nativeElement.click();
            }
        });
    }

    ngAfterViewInit() {
        window.addEventListener('scroll', (event: any) => {
            if (Math.max(event.target.documentElement.scrollTop / (event.target.documentElement.scrollHeight - window.innerHeight) 
            * 100) > 94 && !this.emptyBills && this.notquerying) {
            this.page = this.page + 1;
            this.getBills(this.page);
            }
        });
    }


    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    paymentGatewayCall(i: number) {
        this.service.paymentGatewayCall(this.userDetails + `&order_id=${this.bills[i].orderId}`)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                console.log(res._body);
                this.response = res._body;
            });
    }

    downloadBill(index: number, event: any) {
        if (this.billDownloaded) {
            this.billDownloaded = false;
                this.chatService.downloadFile(this.bills[index].url)
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
    getBills(page: number) {
        this.notquerying = false;
        if (this.selectedUser.role === 'patient') {
            this.sharedService.getBills(this.visitorId, page)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((billings) => {
                    console.log('No of bills received: ' + billings.length + ' on page: ' + page);
                    if (billings.length === 0) {
                        this.emptyBills = true;
                    }
                    billings.map((bill: any) => {
                        this.bills.push(bill);
                        this.bills.push(bill);
                    });
                    console.log(this.bills);
                    this.notquerying = true;
                });
        } else if (this.selectedUser.role === 'doctor') {
            this.sharedService.getBillsByDoctorId(this.selectedUser.id, page)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((billings) => {
                    console.log('No of bills received: ' + billings.length + ' on page: ' + page);
                    if (billings.length === 0) {
                        this.emptyBills = true;
                    }
                    billings.map((bill: any) => {
                        this.bills.push(bill);
                    });
                    this.notquerying = true;
                });
        } else {
            return;
        }
    }

    getBillById(billId: number) {
            this.sharedService.getBillById(this.visitorId, billId)
                .subscribe((billing) => {
                    if (billing) {
                        this.bills = billing;
                    } else {
                        this.noBillWithId = true;
                    }
                });
        }
}
