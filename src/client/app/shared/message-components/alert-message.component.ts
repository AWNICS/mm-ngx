import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

/**
 * AlertMessageComponent displays the text from the chat window
 * @export
 * @class AlertMessageComponent
 */
@Component({
    selector: 'mm-alert-message',
    template: `
            <div>
                {{alertMessage}}
            </div>
    `
})

export class AlertMessageComponent implements OnInit {
    @Input() message:Message;
    alertMessage:string;

    constructor(private liveChatService: LiveChatService) { }

    ngOnInit() {
        this.alertMessage = this.message.text;
    }

    edit(message: string): void {
        this.message.type = message;
        let result = JSON.stringify(this.message);
        if (!result) {
            return;
        }
        this.liveChatService.update(this.message)
            .then(() => {
                return null;
            });
    }
}
