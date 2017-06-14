import { Component, ViewChild } from '@angular/core';
import { DoctorsListService } from './doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';

@Component({
    moduleId: module.id,
    selector: 'mm-video-modal',
    template: `
        <modal [cssClass]="cssClass" #videoModal>
            <modal-header [show-close]="true" (click)="close()">
            </modal-header>
            <modal-body>
                <iframe width="560" height="315" [src]="videoUrl" frameborder="0" allowfullscreen>
                </iframe>
            </modal-body>
        </modal>
    `,
    styles: [`
        /deep/ .modal-test {
            width: 590px;
        }
    `]
})
export class VideoModalComponent {

    videoUrl: string;
    cssClass: string = 'modal-test';

    @ViewChild('videoModal')
    videoModal: VideoModalComponent;

    constructor(private doctorsListService: DoctorsListService) {
    }

    open(size: string) {
        this.videoUrl = this.doctorsListService.getVideoUrl();
        this.videoModal.open(size);
    }

    close() {
        let iframe = document.getElementsByTagName('iframe')[0].contentWindow;
        let func = 'pauseVideo'; // to pause the youtube video on closing the modal window
        iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');
        this.videoModal.close();
    }
}
