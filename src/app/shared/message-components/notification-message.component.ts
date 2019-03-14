import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';

/**
 * TextMessageComponent displays the text from the chat window
 * @//export
 * @//class TextMessageComponent
 */
@Component({
    selector: 'app-notification-message',
    template: `
            <div>
                {{ notificationMessage }}<span>&nbsp;&nbsp;&nbsp;{{ time | date:'sm' }}</span>
            </div>
    `,
    styles: [`
    div {
        font-size:0.70em;
        text-align:center;
        color: #80828c
    }
    `]
})

export class NotificationMessageComponent implements OnInit {
    @Input() message: Message;
    notificationMessage: string;
    time: string;

    ngOnInit() {
        this.notificationMessage = this.message.text;
        this.time = this.message.createdTime;
    }
}
