import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { OrderRequest } from './order-request';

@Injectable()
export class OrderRequestService {
    /*
    3.update timer
    */
    constructor(private http: Http, private router: Router) {
   }

    /*
    1. requescallback
    */
    requestCallBack(orderRequest: OrderRequest) {
        this.router.navigate(['/thanks']);
    }

    /*
    2.submitorder
        - confirmationId
    */
    submitOrderRequest(orderRequest:OrderRequest) {
        console.log('This is OrderRequestService');
        orderRequest.confirmationId = this.randomNumber();
        console.log('The confirmation ID is: ' + orderRequest.confirmationId);
        console.log('The order details are: \n'
        + '\n Full name: ' + orderRequest.fullname
        + '\n Location: ' + orderRequest.location
        + '\n Mail ID: ' + orderRequest.mail
        + '\n Manually entered text: ' + orderRequest.manual
        + '\n Primary tel no: ' + orderRequest.tel
        + '\n Whatsapp no: ' + orderRequest.watel
        + '\n termsAccepted: ' + orderRequest.termsAccepted);
        this.router.navigate(['/thanks']);
    }

    //genereates a random number and returns the same
    randomNumber(): number {
        let rand: number = Math.floor((Math.random() * 1000000));
        return rand;
    }

    //error handler
    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
