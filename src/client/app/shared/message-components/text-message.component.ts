import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';

/**
 * TextMessageComponent displays the text from the chat window
 * @export
 * @class TextMessageComponent
 */
@Component({
    selector: 'mm-text-message',
    template: `
            <div id="message">
                {{textMessage}}
            </div>
    `
})

export class TextMessageComponent implements OnInit {
    @Input() message:Message;
    textMessage:string;

    ngOnInit() {
        this.textMessage = this.message.text;
    }
}
