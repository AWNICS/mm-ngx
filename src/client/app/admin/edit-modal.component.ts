import { Component, ViewChild, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { OrderRequest } from '../shared/database/order-request';
import { Router } from '@angular/router';
import { AdminService } from '../admin/admin.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-edit-modal',
    templateUrl: 'edit-modal.component.html',
    styleUrls: ['create-modal.component.css'],
})
export class EditModalComponent implements OnInit {

    userDetails: FormGroup;
    source: LocalDataSource;
    data: any;

    @ViewChild('modal')
    modal: EditModalComponent;

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
            speciality: [''],
            fullname: [''],
            watel: [''],
            mail: [''],
            uFile: [''],
            manual: [''],
            termsAccepted: [''],
            confirmationId: ['']
        });
    }

    /**
     * function to open the modal window
     * @memberOf OrderWindowComponent
     */
    open(size: string) {
        this.data = this.adminService.getDetails();
        this.userDetails = this.fb.group({
            id:[this.data.id],
            tel: [this.data.tel],
            location: [this.data.location],
            speciality: [this.data.speciality],
            fullname: [this.data.fullname],
            watel: [this.data.watel],
            mail: [this.data.mail],
            uFile: [this.data.uFile],
            manual: [this.data.manual],
            termsAccepted: [this.data.termsAccepted],
            confirmationId: [this.data.confirmationId]
        });
        this.modal.open(size);
    }

    openModal(source: any) {
        this.source = source;
        this.open('sm');
    }

    /**
     * sends a request to the service to create a new entry.
     * @param {{ value: OrderRequest, valid: boolean }} { value, valid }
     * @memberOf OrderWindowComponent
     */
    onSubmit({ value, valid }: { value: OrderRequest, valid: boolean }) {
        this.edit({ value, valid });
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
    edit({ value, valid }: { value: OrderRequest, valid: boolean }): void {
        let result = JSON.stringify(value);
        if (!result) {
            return;
        }
        this.adminService.update(value)
            .then(() => {
                this.source.update(this.data, value);
                this.source.refresh();
                return null;
            });
    }
}
