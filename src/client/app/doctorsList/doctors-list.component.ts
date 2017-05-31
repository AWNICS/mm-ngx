import { Component, ViewChild, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DoctorsListService } from './doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';
import { VideoModalComponent } from './video-modal.component';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctors-list',
    templateUrl: 'doctors-list.component.html',
    styleUrls: ['doctors-list.component.css']
})
export class DoctorsListComponent {

    @ViewChild('doctorsList')
    doctorsList: DoctorsListComponent;

    @ViewChild(VideoModalComponent)
    videoModal: VideoModalComponent;
    doctorDetails: DoctorDetails[];
    safeUrl: any;

    constructor(private doctorsListService: DoctorsListService, private router: Router, private domSanitizer: DomSanitizer) {
        this.getDoctorDetails();
     }

    getDoctorDetails() {
        this.doctorsListService.getDoctorDetails()
        .then((doctorDetail) => {
            this.doctorDetails = doctorDetail;
        });
    }

    open() {
        this.doctorsList.open();
    }

    close() {
        this.doctorsList.close();
    }

    openModal(selectedDoctor: DoctorDetails) {
        this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(selectedDoctor.videoUrl);
        this.doctorsListService.setVideoUrl(this.safeUrl);
        this.videoModal.open('lg');
    }

    navigate(selectedDoctor:DoctorDetails) {
        this.doctorsListService.setSelectedDoctor(selectedDoctor);
    }
}
