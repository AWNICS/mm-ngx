import { Component, Input, ViewChild } from '@angular/core';

@Component({
    selector: 'mm-appear',
    template: `
        <modal [cssClass]="cssClass" #appearModal>
            <modal-header [show-close]="true" (click)="close()">
            </modal-header>
            <modal-body>
                <iframe width="560" height="315" [src]="safeUrl" frameborder="0" allowfullscreen>
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

export class AppearComponent {
    @Input() safeUrl: string;
    cssClass: string = 'modal-test';
    @ViewChild('appearModal')
    appearModal: AppearComponent;

    open(size: string) {
        this.appearModal.open(size);
    }

    close() {
        /*let iframe = document.getElementsByTagName('iframe')[0].contentWindow;
        let func = 'pauseVideo'; // to pause the youtube video on closing the modal window
        iframe.postMessage('{"event":"command","func":"' + func + '","args":""}','*');*/
        this.appearModal.close();
    }
}
