import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

/**
 * ImageMessageComponent to display image
 * @export
 * @class ImageMessageComponent
 */
@Component({
    selector:'mm-image-message',
    template:`
        <h1>{{header}}</h1>
        <img [src]="url" alt="No picture" style="height:100px;width:100px;"/>
    `
})

export class ImageMessageComponent {

    header:string='';
    message: Message;
    url: string;

    constructor(private liveChatService: LiveChatService) {
        this.message = this.liveChatService.getImageMessage();
        this.url = this.message.contentData.data[0];
        this.header = this.message.text;
    }
}
