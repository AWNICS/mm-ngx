import { Component, OnInit } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

/**
 * ImageMessageComponent to display image
 * @export
 * @class ImageMessageComponent
 */
@Component({
    selector:'mm-image-message',
    template:`
        <h1>{{header}}</h1>
        <img src="{{url}}" alt="No picture" style="height:100px;width:100px;"/>
    `
})

export class ImageMessageComponent {

    header:string;
    message: Message;
    url:string;

    constructor(private liveChatService:LiveChatService) {
        this.message = this.liveChatService.getMessage();
            this.url = this.message.contentData.data[0];
            this.header = this.message.text;
    }
}
