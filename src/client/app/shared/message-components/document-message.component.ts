import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * Create a document message
 * @export
 * @class DocumentMessageComponent
 */
@Component({
    selector: 'mm-document-message',
    template: `
    <div *ngIf="url; else loading">
        <a [href]="url" *ngIf="!toggleFileName" download="{{fileName}}">{{fileName}}</a>
        <a [href]="url" *ngIf="toggleFileName" download="{{fileName}}">Download Prescription</a>
    </div>
    <ng-template #loading>
        Downloading PDF ...
    </ng-template>
    `,
    styles: [`
    a {
        color:#000000;
    }
    `]
})

export class DocumentMessageComponent implements OnInit {

    @Input() message: Message;
    url: SafeResourceUrl;
    fileName: string;
    toggleFileName:Boolean = false;
    constructor(
        private chatService: ChatService,
        private sanitizer: DomSanitizer,
        private ref: ChangeDetectorRef
        ) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadDoc(this.message.contentData.data[0]);
            this.fileName = this.message.contentData.data[0];
        }, 5000);
    }

    downloadDoc(fileName: string) {
        fileName.match(/\d+-\d\d-\d\d-[0-9]{4}T\d\d-\d\d-\d\d-[0-9]{3}\.pdf$/i)?this.toggleFileName = true:this.toggleFileName = false;
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                    this.ref.markForCheck();
                };
            });
    }
}
