import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';

/**
 * ImageMessageComponent to display image
 * @export
 * @class ImageMessageComponent
 */
@Component({
    selector: 'mm-image-message',
    template: `
            <!--h1>{{header}}</h1-->
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
    url: any;

    constructor(private chatService: ChatService) { }

    ngOnInit() {
        this.downloadImage(this.message.contentData.data[0]);
    }

    downloadImage(fileName: string) {
        this.chatService.download(fileName)
            .subscribe(res => {
                this.url = res._body;
            });
    }
}
