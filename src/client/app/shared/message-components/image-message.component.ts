import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * ImageMessageComponent to display image
 * @export
 * @class ImageMessageComponent
 */
@Component({
    selector: 'mm-image-message',
    template: `
            <div *ngIf="url; else loading">
                <img [src]="url" alt="Image" class="rounded img-fluid">
            </div>
            <ng-template #loading>
                Loading...
            </ng-template>
    `
})

export class ImageMessageComponent implements OnInit {
    @Input() message: Message;
    url: SafeResourceUrl;

    constructor(private chatService: ChatService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadImage(this.message.contentData.data[0]);
        }, 5000);
    }

    downloadImage(fileName: string) {
        this.chatService.downloadImage(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustUrl(res.result);
                }
            });
    }
}
