import { Component, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorsListService } from './doctors-list.service';
import { DoctorDetails } from '../shared/database/doctor-details';

/**
 * Component for video modal window
 * @export
 * @class VideoModalComponent
 */
@Component({
    selector: 'mm-video-modal',
    template: `
        <!--modal [cssClass]="cssClass" #videoModal-->
        <modal #videoModal>
            <modal-header [show-close]="true" (click)="close()">
            </modal-header>
            <modal-body>
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" [src]="videoUrl" allowfullscreen>
                    </iframe>
                </div>
            </modal-body>
        </modal>
    `/*,
    styles: [`
        /deep/ .modal-style {
            width: 100% !important;
            height: auto !important;
        }
    `]*/
})

export class VideoModalComponent {

    videoUrl: any = '';
    //cssClass: string = 'modal-style';
    @ViewChild('videoModal')
    videoModal: VideoModalComponent;

    constructor(private doctorsListService: DoctorsListService, private domSanitizer:DomSanitizer) {
        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
    }

    open(size: string) {
        this.videoUrl = this.doctorsListService.getVideoUrl();
        this.videoModal.open(size);
    }

    /**
     * function to stop playing the video when the modal window is closed
     * @memberof VideoModalComponent
     */
    close() {
        let iframe = document.getElementsByTagName('iframe')[0].contentWindow;
        let func = 'pauseVideo'; // to pause the youtube video on closing the modal window
        iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
        this.videoModal.close();
    }
}
