import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderRequest } from '../order-window/order-request';
import { AdminService } from './admin.service';

@Component({
    moduleId: module.id,
    selector: 'mm-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})

export class AdminComponent implements OnInit{
    orderRequests: OrderRequest[];
    selectedOrderRequest: OrderRequest;
    title: string = 'Welcome Admin';
    customerDetails: FormGroup;

    constructor(private adminService: AdminService, private fb: FormBuilder) {
        this.getOrderRequests();
    }

    /**
     * FormGroup initialization
     * @memberOf AdminComponent
     */
    ngOnInit():void {
        this.customerDetails = this.fb.group({
            tel: [''],
            location: [''],
            fullname: [''],
            watel: [ ''],
            mail: [''],
            termsAccepted:[''],
            confirmationId: ['']
        });
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
        console.log('This is the selected entry: ' + this.selectedOrderRequest.fullname);
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
    add({ value, valid }: { value: OrderRequest, valid: boolean }):void {
        let result = JSON.stringify(value);
        if(!result) {
            return;
        }
        this.adminService.create(value)
        .then(orderRequest => {
            this.orderRequests.push(orderRequest);
        });
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
