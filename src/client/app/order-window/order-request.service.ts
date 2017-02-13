import { Injectable } from '@angular/core';
import { OrderRequest } from './order-request';
import { Http } from '@angular/http';

@Injectable()
export class OrderRequestService {

    constructor(private http:Http) {
        console.log("Loading the application from OrderRequestService");
    }

    getOrderDetails() {
        return this.http.get('src/client/app/shared/data/order-details.json')
                .map(res => res.json());
    }
}