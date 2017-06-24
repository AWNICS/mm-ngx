import { Component, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

/**
 * Create a video message
 * @export
 * @class VideoMessageComponent
 */
@Component({
    selector:'mm-video-message',
    template:`
        <h1>{{title}}</h1>
        <video width="400" controls>
            <source src="{{url}}" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>
    `
})

export class VideoMessageComponent implements OnInit {

    title:string;
    message: Message;
    url:string;

    constructor(private liveChatService:LiveChatService) {
    }

    ngOnInit() {
        this.message = this.liveChatService.getVideoMessage();
        this.url = this.message.contentData.data[0];
        this.title = this.message.text;
    }
}
