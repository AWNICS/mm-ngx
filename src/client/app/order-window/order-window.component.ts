import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderRequest } from '../shared/database/order-request';
import { OrderRequestService } from './order-request.service';
import { Router } from '@angular/router';
import { AdminService } from '../admin/admin.service';

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
    @Input() speciality: string; //input for speciality from homeComponent
    @Output() orderRequests: OrderRequest[] = [];

    confirmId: number;
    userDetails: FormGroup;

    @ViewChild('modal')
    modal: OrderWindowComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private orderRequestService: OrderRequestService,
        private adminService: AdminService
    ) { }

    /**
     * initialising form group
     * @memberOf OrderWindowComponent
     */
    ngOnInit(): void {
        this.confirmId = this.orderRequestService.randomNumber();
        this.userDetails = this.fb.group({
            tel: [''],
            speciality: [''],
            fullname: [''],
            watel: [''],
            mail: [''],
            uFile: [''],
            manual: [''],
            termsAccepted: [true],
            confirmationId: [this.confirmId]
        });
    }

    /**
     * function to open the modal window
     * @memberOf OrderWindowComponent
     */
    open() {
        this.modal.open();
    }

    /**
     * sends a request to the service to create a new entry and redirect to thank you page.
     * @param {{ value: OrderRequest, valid: boolean }} { value, valid }
     * @memberOf OrderWindowComponent
     */
    onSubmit({ value, valid }: { value: OrderRequest, valid: boolean }) {
        this.orderRequestService.submitOrderRequest();
        this.add({ value, valid });
        this.modal.close();
    }

    /**
     * sends a request to the service to create a new entry and redirect to thank you page.
     * @param {{value:OrderRequest, valid: boolean}} {value, valid}
     * @memberOf OrderWindowComponent
     */
    requestCallback({ value, valid }: { value: OrderRequest, valid: boolean }) {
        this.orderRequestService.requestCallBack();
        this.add({ value, valid });
        this.modal.close();
    }

    /**
     * function to close the modal window
     * @memberOf OrderWindowComponent
     */
    close() {
        this.modal.close();
    }

    /**
     * adds a new entry into the table
     * @param {{ value: OrderRequest, valid: boolean }} { value, valid }
     * @returns {void}
     * @memberOf OrderWindowComponent
     */
    add({ value, valid }: { value: OrderRequest, valid: boolean }): void {
        let result = JSON.stringify(value);
        if (!result) {
            return;
        }
        this.adminService.create(value)
            .then(orderRequest => {
                this.orderRequests.push(orderRequest);
        });
    }
}
