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
    selector: 'mm-upload-modal',
    template: `
    <modal #modal>
    <modal-header [show-close]="true">
        <h4 class="modal-title">Upload an image:</h4>
    </modal-header>
    <modal-body>
        <form>
            <input type="file" name="pic" accept="image/*"><br/>
            <button type="submit" class="btn btn-primary">Submit</button>
            <button type="button" class="btn btn-default" data-dismiss="modal" (click)="modal.dismiss()">Cancel</button>
        </form>
    </modal-body>
</modal>
    `,
    styleUrls: ['create-modal.component.css'],
})
export class UploadModalComponent {

    @ViewChild('modal')
    modal: UploadModalComponent;

    /**
     * function to open the modal window
     * @memberOf OrderWindowComponent
     */
    open(size: string) {
        this.modal.open(size);
    }

    /**
     * sends a request to the service to create a new entry.
     * @param {{ value: OrderRequest, valid: boolean }} { value, valid }
     * @memberOf OrderWindowComponent
     */
    onSubmit() {
        this.modal.close();
    }

    /**
     * function to close the modal window
     * @memberOf OrderWindowComponent
     */
    close() {
        this.modal.close();
    }
}
