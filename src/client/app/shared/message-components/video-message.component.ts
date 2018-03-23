import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

/**
 * Create a video message
 * @export
 * @class VideoMessageComponent
 */
@Component({
    selector: 'mm-video-message',
    template: `
        <video controls *ngIf="url else loading">
            <source [src]="url" type="video/mp4">
            <source [src]="url" type="video/webm">
            Your browser does not support HTML5 video.
            {{url}}
        </video>
        <ng-template #loading>
                Loading...
        </ng-template>
    `,
    styles: [`
        video {
            width: 100%    !important;
            height: auto   !important;
        }
    `]
})

export class VideoMessageComponent implements OnInit {

    @Input() message: Message;
    url: SafeResourceUrl;

    constructor(private chatService: ChatService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadVideo(this.message.contentData.data[0]);
        }, 5000);
    }

    downloadVideo(fileName: string) {
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustUrl(res.result);
                };
            });
    }
}
