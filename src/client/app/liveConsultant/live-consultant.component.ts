import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LiveConsultantService } from './live-consultant.service';
import { DoctorDetails } from '../shared/database/doctorDetails';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-live-consultant',
    templateUrl: 'live-consultant.component.html',
    styleUrls: ['live-consultant.component.css'],
})
export class LiveConsultantComponent {

    @ViewChild('consultantModal')
    modal: LiveConsultantComponent;

    doctorDetails: DoctorDetails[];

    constructor(private liveConsultantService: LiveConsultantService) { }

    getDoctorDetails() {
        this.liveConsultantService.getDoctorDetails()
        .then((doctorDetails) => {
            this.doctorDetails = doctorDetails;
        });
    }

    /**
     * function to open the modal window
     * @memberOf OrderWindowComponent
     */
    open() {
        this.getDoctorDetails();
        this.modal.open();
    }

    /**
     * function to close the modal window
     * @memberOf OrderWindowComponent
     */
    close() {
        this.modal.close();
    }
}
