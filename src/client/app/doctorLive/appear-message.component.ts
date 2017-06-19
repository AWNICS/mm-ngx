import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

/**
 * appear component to load the appear call in an iframe
 * @export
 * @class AppearMessageComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'mm-appear-message',
    template: `
        <h1>{{title}}</h1>
        <iframe width="560" height="315" [src]="safeUrl" frameborder="0" allowfullscreen>
        </iframe>
    `
})

export class AppearMessageComponent implements OnInit {
    @Input() safeUrl: string;
    title:string;
    message: Message;

    constructor(private liveChatService: LiveChatService) {}

    ngOnInit() {
        this.message = this.liveChatService.getMessage();
        this.title = this.message.text;
    }
}

