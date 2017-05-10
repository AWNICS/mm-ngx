import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderRequest } from '../order-window/order-request';
import { Router } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-create-modal',
    templateUrl: 'create-modal.component.html',
    styleUrls: ['create-modal.component.css'],
})
export class CreateModalComponent implements OnInit {

    orderRequests: OrderRequest[] = [];
    userDetails: FormGroup;
    source: LocalDataSource;
    @Input() orderRequest: OrderRequest;

    @ViewChild('modal')
    modal: CreateModalComponent;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private adminService: AdminService
    ) {
     }

    /**
     * initialising form group
     * @memberOf OrderWindowComponent
     */
    ngOnInit(): void {
        this.userDetails = this.fb.group({
            tel: [''],
            location: [''],
            fullname: [''],
            watel: [''],
            mail: [''],
            uFile: [''],
            manual: [''],
            termsAccepted: [true],
            confirmationId: ['']
        });
    }

    /**
     * function to open the modal window
     * @memberOf OrderWindowComponent
     */
    open(size: string) {
        this.modal.open(size);
    }

    openModal(source: any) {
        this.source = source;
        this.modal.open('sm');
    }

    /**
     * sends a request to the service to create a new entry.
     * @param {{ value: OrderRequest, valid: boolean }} { value, valid }
     * @memberOf OrderWindowComponent
     */
    onSubmit({ value, valid }: { value: OrderRequest, valid: boolean }) {
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
                this.source.add(orderRequest);
                this.source.refresh();
            });
        //this.adminService.setNewDetails(value);
            //this.source.add(value);
    }
}
