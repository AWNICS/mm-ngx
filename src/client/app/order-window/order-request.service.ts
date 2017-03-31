import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { OrderRequest } from './order-request';

@Injectable()
export class OrderRequestService {

    constructor(private http: Http, private router: Router) {
   }

    /*
    1. requescallback
    */
    requestCallBack(orderRequest: OrderRequest) {
        // orderRequest.confirmationId = this.randomNumber();
        // console.log('The confirmation ID is: ' + orderRequest.confirmationId);
        /*console.log('The order details are: \n'
        + '\n Location: ' + orderRequest.location // for debugging purpose only
        + '\n Primary tel no: ' + orderRequest.tel
        + '\n termsAccepted: ' + orderRequest.termsAccepted);*/
        this.router.navigate(['/thanks']);
    }

    /*
    2.submitorder
        - confirmationId
    */
    submitOrderRequest(orderRequest:OrderRequest) {
        // console.log('This is OrderRequestService'); // for debuggin purpose only
        // orderRequest.confirmationId = this.randomNumber();
        // console.log('The confirmation ID is: ' + orderRequest.confirmationId);
        console.log('The order details are: \n'
        + '\n Full name: ' + orderRequest.fullname
        + '\n Location: ' + orderRequest.location
        + '\n Mail ID: ' + orderRequest.mail // for debugging purpose only
        + '\n Manually entered text: ' + orderRequest.manual
        + '\n Primary tel no: ' + orderRequest.tel
        /* are we supposed to get the mobile number from home component here or from the model window?
        If we try to fetch the primary number from the modal window, chances are the customer might delete the
        primary number and proceed with the submitOrderRequest.
        There might be two solutions to this:
        1. Make the phone number fields required.
        2. Or disable the primary number field.
        */
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
