import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { ChatService } from '../chat/chat.service';
import { SocketService } from '../chat/socket.service';
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'mm-payment',
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
    page:number = 1;
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
        this.navbarComponent.navbarColor(0, '#6960FF');
        this.visitorId = +this.route.snapshot.paramMap.get('id');// this will give the visitor id
        const cookie = JSON.parse(this.securityService.getCookie('userDetails'));
        if (cookie === '') {
            this.router.navigate([`/login`]);
        } else {
            this.selectedUser = cookie;
            if (window.localStorage.getItem('pageReloaded') === 'true') {
                console.log('Page Reloaded');
                this.socketService.connection(this.selectedUser.id);
              }
        let billId = this.route.snapshot.queryParams.bill_id;
        if(billId && billId!=='null' && this.selectedUser.role==='patient') {
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
        window.addEventListener('scroll',(event:any) => {
            if (event.target.documentElement.scrollTop + event.target.documentElement.clientHeight ===
                event.target.documentElement.offsetHeight || event.target.documentElement.scrollTop +
                 event.target.documentElement.clientHeight + 1 >= event.target.documentElement.offsetHeight) {
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
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res: any) => {
                //letting these stay if we change implementation for iframe these calculations would be helpful
                // let  wind:any = window;
                // let width = wind.innerWidth - 40;
                // let height = (482*638)/width+20;
                // res._body = res._body.replace(/width="\d+"/,`width="${width}"`);
                // res._body = res._body.replace(/height="\d+"/,`height="${height}"`);
                console.log(res._body);
                this.response = res._body;
            });
    }

    downloadBill(index:number, event:any) {
        if(this.billDownloaded) {
            this.billDownloaded = false;
                this.chatService.downloadFile(this.bills[index].url)
                .takeUntil(this.unsubscribeObservables)
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
    getBills(page:number) {
        if (this.selectedUser.role === 'patient') {
            this.sharedService.getBills(this.visitorId, page)
            .takeUntil(this.unsubscribeObservables)
                .subscribe((billings) => {
                    billings.map((bill:any)=> {
                        this.bills.push(bill);
                    });
                });
        } else if (this.selectedUser.role === 'doctor') {
            this.sharedService.getBillsByDoctorId(this.selectedUser.id, page)
            .takeUntil(this.unsubscribeObservables)
                .subscribe((billings) => {
                    billings.map((bill:any)=> {
                        this.bills.push(bill);
                    });
                });
        } else {
            return;
        }
    }

    getBillById(billId:number) {
            this.sharedService.getBillById(this.visitorId,billId)
                .subscribe((billing) => {
                    this.bills = billing;
                });
        }
}
