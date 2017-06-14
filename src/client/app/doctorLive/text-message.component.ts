import { Component, Input } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

@Component({
    selector: 'mm-text-message',
    template: `
            <div>
                {{message}}
            </div>
    `
})

export class TextMessageComponent {
    @Input() message:string;
}
