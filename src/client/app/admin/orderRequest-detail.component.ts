import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderRequest } from '../order-window/order-request';
import { AdminService } from './admin.service';

@Component({
    moduleId: module.id,
    selector: 'mm-order-detail',
    templateUrl: 'orderRequest-detail.component.html',
    styleUrls: ['orderRequest-detail.component.css']
})

export class OrderRequestDetailComponent {
    @Input() orderRequest: OrderRequest; // input for the employee detail block to edit

    customerDetails: FormGroup;
    constructor(private adminService: AdminService) {}

    save(): void {
        this.adminService.update(this.orderRequest);
        console.log('New value saved successfully');
    }
}
