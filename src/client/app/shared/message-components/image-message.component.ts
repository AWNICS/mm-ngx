import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../database/message';

/**
 * ImageMessageComponent to display image
 * @export
 * @class ImageMessageComponent
 */
@Component({
    selector:'mm-image-message',
    template:`
        <h1>{{header}}</h1>
        <img [src]="url" alt="No picture"/>
    `,
    styles: [`
        img {
            height: 30%;
            width: 30%;
            border: none;
            border-radius: 10%;
        }
    `]
})

export class ImageMessageComponent implements OnInit {

    header:string='';
    @Input() message: Message;
    url: string;

    ngOnInit() {
        this.url = this.message.contentData.data[0];
        this.header = this.message.text;
    }
}
