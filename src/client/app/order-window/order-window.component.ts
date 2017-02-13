import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { OrderRequest } from './order-request';
import { OrderRequestService } from './order-request.service';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-order-window',
  templateUrl: 'order-window.component.html',
  styleUrls: ['order-window.component.css'],
})
export class OrderWindowComponent implements OnInit{

    selectDetails: OrderRequest;

    constructor(private orderRequestService: OrderRequestService) {}

    ngOnInit() {
    }

    @Input() result:number;

    @ViewChild('modal')
    modal: OrderWindowComponent;
    open(){
        console.log("This is coming from order window component: " + this.result);
        this.modal.open();
    }

    onSubmit(fullName:string, watel:number, mail:string, uFile:any, manual:string, check:boolean) {
        console.log("Phone number from home component: " + this.result 
        + "\nFullname is: " + fullName 
        + "\n Whatsapp number is: " + watel 
        + "\n Mail ID: " + mail
        + "\n File uploaded: " + uFile
        + "\n Manual instructions: " + manual
        + "\n Checkbox: " + check);
        this.modal.close();
    }

    requestCallback(tel:number) {
        console.log("This number comes from requestCallback function" +tel);
        this.modal.close();
    }

    close() {
        this.modal.close();
    }
 }