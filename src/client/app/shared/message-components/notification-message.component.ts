import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';

/**
 * TextMessageComponent displays the text from the chat window
 * @export
 * @class TextMessageComponent
 */
@Component({
    selector: 'mm-notification-message',
    template: `
            <div>
                {{notificationMessage}}
            </div>
    `,
    styles:[`
    div {
        font-size:0.75em;
        position:absolute;
        left:50%;
        transform: translateX(-50%);
        color: #80828c
    }
    `]
})

export class NotificationMessageComponent implements OnInit {
    @Input() message:Message;
    notificationMessage:string;

    ngOnInit() {
        this.notificationMessage = this.message.text;
    }
}
