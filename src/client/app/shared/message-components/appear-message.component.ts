import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

/**
 * appear component to load the appear call in an iframe
 * @export
 * @class AppearMessageComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'mm-appear-message',
    template: `
        <h3>{{title}}</h3>
        <button type="button" class="btn btn-default" (click)="submit();"><a [href]="safeUrl" target="_blank">Start</a></button>
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
    @Input() message: Message;

    constructor(private liveChatService: LiveChatService) {}

    ngOnInit() {
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

