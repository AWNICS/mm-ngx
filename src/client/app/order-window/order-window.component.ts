import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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

    @Input() result: number;

    orderRequest: FormGroup;

    @ViewChild('modal')
    modal: OrderWindowComponent;

    constructor(private fb: FormBuilder, private router: Router) {}

    ngOnInit() {
        this.orderRequest = this.fb.group({
            tel: [ ''],
            fullname: [''],
            watel: [ ''],
            mail: [''],
            uFile:[''],
            manual:[''],
            termsAccepted:[true]
        });
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

    onSubmit({ value, valid }: { value: OrderRequest, valid: boolean }) {
        this.modal.close();
        console.log(value, 'Is form valid? ' + valid);
        this.router.navigate(['/thanks']);
    }

    /*
    try out reactive forms
    */

    close() {
        this.modal.close();
    }
 }
