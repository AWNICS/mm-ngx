import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OrderRequest } from '../order-window/order-request';
import { AdminService } from './admin.service';
import { Ng2SmartTableModule, LocalDataSource } from 'ng2-smart-table';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CreateModalComponent } from './create-modal.component';
import { EditModalComponent } from './edit-modal.component';
import { ImageRenderComponent } from './image-render.component';
import { MailToComponent } from './mailTo.component';
/**
 * @export
 * @class AdminComponent
 * @implements {OnInit}
 */
@Component({
    moduleId: module.id,
    selector: 'mm-admin',
    templateUrl: 'admin.component.html',
    styleUrls: ['admin.component.css']
})

export class AdminComponent implements OnInit {
    orderRequests: OrderRequest[];
    title: string = 'Welcome Admin';
    customerDetails: FormGroup;
    source: LocalDataSource = new LocalDataSource(); // setting LocalDataSource for the table

    @ViewChild(CreateModalComponent)
    modalHtml: CreateModalComponent;

    @ViewChild(EditModalComponent)
    modalHtml1: EditModalComponent;

    /**
     * settings for the smart table
     * @memberOf AdminComponent
     */
    settings = {
        mode: 'external',
        actions: {
            columnTitle: 'Actions',
            position: 'right'
        },
        columns: {
            dp: {
                title: 'Display Picture',
                type: 'custom',
                width: '20px',
                filter: false,
                renderComponent: ImageRenderComponent
            },
            id: {
                title: 'ID',
                filter: false
            },
            fullname: {
                title: 'Fullname',
                filter: false
            },
            tel: {
                title: 'Primary Tel No.',
                filter: false
            },
            watel: {
                title: 'Whatsapp No.',
                filter: false
            },
            location: {
                title: 'Location',
                filter: false
            },
            mail: {
                title: 'Email',
                filter: false,
                type: 'custom',
                renderComponent: MailToComponent
            },
            manual: {
                title: 'Manual message',
                filter: false
            },
            termsAccepted: {
                title: 'Terms Accepted',
                filter: false
            },
            confirmationId: {
                title: 'Confirmation ID',
                filter: false
            }
        }
    };

    /**
     * Creates an instance of AdminComponent.
     * @param {AdminService} adminService
     * @param {FormBuilder} fb
     *
     * @memberof AdminComponent
     */
    constructor(private adminService: AdminService, private fb: FormBuilder) {
        this.getOrderRequests();
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
            manual: [''],
            id: [''],
            dp: [''],
            button: ['']
        });
    }

    onSearch(query: string = '') {
        this.source.setFilter([
            // fields we want to include in the search
            {
                field: 'id',
                search: query
            },
            {
                field: 'fullname',
                search: query
            },
            {
                field: 'tel',
                search: query
            },
            {
                field: 'mail',
                search: query
            }
        ], false);
        // second parameter specifying whether to perform 'AND' or 'OR' search
        // (meaning all columns should contain search query or at least one)
        // 'AND' by default, so changing to 'OR' by setting false here
    }


    /**
     * function to get the orderRequests stored in the database
     * @memberof AdminComponent
     */
    getOrderRequests() {
        this.adminService.getOrderRequests()
            .then((orderRequests) => {
                this.orderRequests = orderRequests;
                this.source.load(orderRequests);
            });
    }

    /**
     * function to open the modal window on create
     * @param {*} event
     * @memberof AdminComponent
     */
    onCreate(event: any) {
        this.modalHtml.openModal(this.source);
    }

    /**
     * delete function that removes a row from the table
     * @param {*} orderRequest
     * @memberof AdminComponent
     */
    onDelete(orderRequest: any) {
        this.adminService.delete(orderRequest.data)
        .then(() => {
            this.orderRequests = this.orderRequests.filter(o => o !== orderRequest);
        });
        this.source.remove(orderRequest.data);
    }

    /**
     * edit function that sets the data for a selected row and open modal window
     * @param {*} event
     * @memberof AdminComponent
     */
    onSave(event: any) {
        this.adminService.setDetails(event.data);
        this.modalHtml1.openModal(this.source);
    }
}
