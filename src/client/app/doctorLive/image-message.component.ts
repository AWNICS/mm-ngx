import { Component, OnInit } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

@Component({
    selector:'mm-image-message',
    template:`
        <p>This is image component</p>
        <img src="{{url}}" alt="No picture" style="height:100px;width:100px;"/>
    `
})

export class ImageMessageComponent implements OnInit {

    //urls:string[];
    message: Message;
    url:string;

    constructor(private liveChatService:LiveChatService) {
        this.message = this.liveChatService.getMessage();
            this.url = this.message.contentData.data[0];
    }

    ngOnInit() {
        //
    }
}
