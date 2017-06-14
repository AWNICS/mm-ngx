import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { OrderRequest } from './order-request';

@Injectable()
export class OrderRequestService {

    constructor(private router: Router) {
   }

    requestCallBack() {
        this.router.navigate(['/thanks']);
    }

    submitOrderRequest() {
        this.router.navigate(['/thanks']);
    }

    randomNumber(): number {
        let rand: number = Math.floor((Math.random() * 1000000));
        return rand;
    }
}
