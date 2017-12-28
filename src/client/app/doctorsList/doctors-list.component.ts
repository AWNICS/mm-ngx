import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DoctorsListService } from './doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';
import { VideoModalComponent } from './video-modal.component';

/**
 * This class represents the lazy loaded DoctorsListComponent.
 * @export
 * @class DoctorsListComponent
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctors-list',
    templateUrl: 'doctors-list.component.html',
    styleUrls: ['doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {

    @ViewChild('doctorsList')
    doctorsList: DoctorsListComponent;
    @ViewChild(VideoModalComponent)
    videoModal: VideoModalComponent;
    doctorDetails: DoctorDetails[];
    safeUrl: any;

    constructor(
        private doctorsListService: DoctorsListService,
        private router: Router,
        private domSanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.getDoctorDetails();
    }

    /**
     * get the doctorlist from the services
     * @memberof DoctorsListComponent
     */
    getDoctorDetails() {
        this.doctorsListService.getDoctorDetails()
            .subscribe((doctorDetail) => {
                this.doctorDetails = doctorDetail;
            });
    }

    open(size:string) {
        this.doctorsList.open('lg');
    }

    close() {
        this.doctorsList.close();
    }

    openModal(selectedDoctor: DoctorDetails) {
        // domSanitizer for url passing to iframe
        this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(selectedDoctor.videoUrl);
        this.doctorsListService.setVideoUrl(this.safeUrl);
        this.videoModal.open('lg');
    }

    navigate(selectedDoctor: DoctorDetails) {
        this.doctorsListService.setSelectedDoctor(selectedDoctor);
    }
}
