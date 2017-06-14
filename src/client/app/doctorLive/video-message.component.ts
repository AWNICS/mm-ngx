import { Component } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

@Component({
    selector:'mm-video-message',
    template:`
        <p>This is video component</p>
        <video width="400" controls>
            <source src="{{url}}" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>
    `
})

export class VideoMessageComponent {
    message: Message;
    url:string;

    constructor(private liveChatService:LiveChatService) {
        this.message = this.liveChatService.getMessage();
            this.url = this.message.contentData.data[0];
    }
}
