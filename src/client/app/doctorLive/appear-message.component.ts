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
        <button type="button" class="btn btn-info" (click)="submit();"><a [href]="safeUrl" target="_blank">Start</a></button>
    `,
    styles: [`
        a:link,active,visited,hover {
            color:white;
            text-decoration:none;
        }
    `]
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

    submit() {
        this.message.contentType = 'text';
        this.message.text = 'Kindly leave your valuable feedback!';
        this.message.type = 'in';
        this.edit(this.message);
    }

    edit(message: Message): void {
        let result = JSON.stringify(message);
        if (!result) {
            return;
        }
        this.liveChatService.update(this.message)
            .then(() => {
                return null;
            });
    }
}

