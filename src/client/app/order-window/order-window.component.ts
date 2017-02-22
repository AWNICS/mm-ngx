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
export class OrderWindowComponent implements OnInit{

    @Input() result: number;

    orderRequest: OrderRequest;

    @ViewChild('modal')
    modal: OrderWindowComponent;

    constructor(private orderRequestService: OrderRequestService) { }

    ngOnInit() {
    }

    open(){
        console.log("This is coming from order window component: " + this.result);
        this.modal.open();
    }

    onSubmit() {
        this.modal.close();
    }

    requestCallback(tel:number) {
        this.modal.close();
    }

    close() {
        this.modal.close();
    }
 }