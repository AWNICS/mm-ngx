import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../database/message';

/**
 * Create a video message
 * @export
 * @class VideoMessageComponent
 */
@Component({
    selector:'mm-video-message',
    template:`
        <h1>{{title}}</h1>
        <video controls>
            <source [src]="url" type="video/mp4">
            Your browser does not support HTML5 video.
        </video>
    `,
    styles: [`
        video {
            width: 80%;
            height: 80%;
            border: none;
            border-radius: 5%;
        }
    `]
})

export class VideoMessageComponent implements OnInit {

    title:string;
    @Input() message: Message;
    url:string;

    ngOnInit() {
        this.url = this.message.contentData.data[0];
        this.title = this.message.text;
    }
}
