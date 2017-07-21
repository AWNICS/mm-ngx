import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';

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

    ngOnInit() {
        this.alertMessage = this.message.text;
    }
}
