import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { OrderRequest } from './order-request';
import { OrderRequestService } from './order-request.service';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-order-window',
  templateUrl: 'order-window.component.html',
  styleUrls: ['order-window.component.css'],
})
export class OrderWindowComponent implements OnInit {

    @Input() result: number;

    orderRequest: OrderRequest;

    tel:number;
    fullname:string;
    watel:number;
    mail:string;
    uFile:string;
    manual:string;
    termsAccepted: boolean;

    @ViewChild('modal')
    modal: OrderWindowComponent;

    constructor(private orderRequestService: OrderRequestService) { }

    ngOnInit() {
        console.log('Loading in order window component');
    }

    open() {
        console.log('This is coming from order window component: ' + this.result);
        this.modal.open();
    }

    /*
    traditional approach. use it as a back up only.
    extract the value of all the variables from HTML template.
    compose orderRequest object
    pass the orderRequest object to OrderRequest service
    return success or failure with a confirmation ID
    */

    onSubmit(values:any) {
        this.modal.close();
        console.log(values);
    }

    /*
    try out reactive forms
    */
    requestCallback(values:any) {
        this.modal.close();
        console.log(values);
        console.log(values.tel);
    }

    close() {
        this.modal.close();
    }
 }
