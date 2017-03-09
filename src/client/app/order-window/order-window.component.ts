import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderRequest } from './order-request';
import { OrderRequestService } from './order-request.service';
import { Router } from '@angular/router';

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

    @Input() result: number; //input for telephone field
    @Input() location: string; //input for location from homeComponent

    userDetails: FormGroup;
    orderRequest: OrderRequest;

    @ViewChild('modal')
    modal: OrderWindowComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private orderRequestService: OrderRequestService
        ) {}

    //intialization of the variables in FormBuilder
    ngOnInit():void {
        this.userDetails = this.fb.group({
            tel: [''],
            location: [''],
            fullname: [''],
            watel: [ ''],
            mail: [''],
            uFile:[''],
            manual:[''],
            termsAccepted:[true]
        });
    }

    //function to open modal window
    open() {
        console.log('This is coming from order window component: ' + this.result);
        console.log('This is coming from order window component: ' + this.location);
        this.modal.open();
    }

    /*
    traditional approach. use it as a back up only.
    1.validate all the form variables
    2.extract the value of all the variables from HTML template.
    3.compose orderRequest object
    4.pass the orderRequest object to OrderRequest service
    5.confirmation ID is generated in the service and updated to orderRequest information
    6.OrderRequestService returns orderRequest object with a confirmation ID or failure
    7.In thank you page, show orderRequest information with confirmation ID
    */

    //function to continue workflow after submitting the form
    onSubmit({ value, valid }: { value: OrderRequest, valid: boolean }) {
        console.log(value, 'Is the form valid? ' + valid);
        this.orderRequestService.submitOrderRequest(value);
        this.modal.close();
        this.router.navigate(['/thanks']);
    }

    //function to close modal window
    close() {
        this.modal.close();
    }
 }
