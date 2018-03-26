import { Component, OnInit, Input } from '@angular/core';
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
        <a [href]="url" download="{{fileName}}">Download {{fileName}}</a>
    </div>
    <ng-template #loading>
        Loading...
    </ng-template>
    `
})

export class DocumentMessageComponent implements OnInit {

    @Input() message: Message;
    url: SafeResourceUrl;
    fileName: string;

    constructor(private chatService: ChatService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadDoc(this.message.contentData.data[0]);
            this.fileName = this.message.contentData.data[0];
        }, 5000);
    }

    downloadDoc(fileName: string) {
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                };
            });
    }
}
