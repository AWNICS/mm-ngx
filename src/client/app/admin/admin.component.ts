import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderRequest } from '../order-window/order-request';
import { AdminService } from './admin.service';

@Component({
    moduleId: module.id,
    selector: 'mm-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})

export class AdminComponent implements OnInit {
    orderRequests: OrderRequest[];
    selectedOrderRequest: OrderRequest;
    title: string = 'Welcome Admin';
    customerDetails: FormGroup;

    constructor(private adminService: AdminService, private fb: FormBuilder) {
    }

    /**
     * FormGroup initialization
     * @memberOf AdminComponent
     */
    ngOnInit() {
        this.customerDetails = this.fb.group({
            tel: ['', [Validators.required]],
            location: ['', [Validators.required]],
            fullname: ['', [Validators.required]],
            watel: ['', [Validators.required]],
            mail: [''],
            termsAccepted: [''],
            confirmationId: [''],
            manual: ['']
        });
        this.getOrderRequests();
    }

    /**
     * returns the orderRequests
     * @returns
     * @memberOf AdminComponent
     */
    getOrderRequests(): void {
        this.adminService.getOrderRequests()
            .then(orderRequests => this.orderRequests = orderRequests);
    }

    /**
     * sets the selectedOrderRequest
     * @param {OrderRequest} orderRequest
     * @memberOf AdminComponent
     */
    onSelect(orderRequest: OrderRequest): void {
        this.selectedOrderRequest = orderRequest;
    }

    /**
     * displays and hides the edit block on button click
     * @memberOf AdminComponent
     */
    edit(): void {
        let result = document.getElementById('edit').style.display;
        if (result === 'none') {
            document.getElementById('edit').style.display = 'block';
        } else {
            document.getElementById('edit').style.display = 'none';
        }
    }

    /**
     * passing the orderRequest object to the in memory db service
     * @param {{ value: OrderRequest, valid: boolean }} { value, valid }
     * @returns {void}
     * @memberOf AdminComponent
     */
    add({ value, valid }: { value: OrderRequest, valid: boolean }): void {
        this.adminService.create(value)
            .then(orderRequest => {
                this.orderRequests.push(orderRequest);
                console.log('All: ' + JSON.stringify(this.orderRequests));
            });
        this.selectedOrderRequest = null;
        this.customerDetails.reset();
    }

    /**
     * deletes an entry from the table
     * @param {OrderRequest} orderRequest
     * @memberOf AdminComponent
     */
    delete(orderRequest: OrderRequest): void {
        this.adminService
            .delete(orderRequest.confirmationId)
            .then(() => {
                this.orderRequests = this.orderRequests.filter((o: any) => o !== orderRequest);
                if (this.selectedOrderRequest === orderRequest) { this.selectedOrderRequest = null; }
            });
    }
}
