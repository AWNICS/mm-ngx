import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctor-live/live-chat.service';

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
        <a [href]="safeUrl" target="_blank">
        <button type="button" class="btn btn-secondary" (click)="submit();">
            Start
        </button></a>
    `,
    styles: [`
        #btn {
            color: white;
            background-color: blue;
            margin: 2px;
            padding: 5px;
            text-align: center;
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
        if(this.message.type === 'in') {
            this.message.type = 'in';
        } else {
            this.message.type = 'out';
        }
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

