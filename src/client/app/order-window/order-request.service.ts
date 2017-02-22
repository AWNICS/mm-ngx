import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { OrderRequest } from './order-request';

@Injectable()
export class OrderRequestService {

    orderRequest: OrderRequest[];

    constructor(private _http:Http) {}
}