import { Component } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

@Component({
    selector: 'mm-radio-message',
    template: `
        <p>Select one among the below:</p>
        <label *ngFor="let item of items">
            <input type="radio" name="options" (click)="model.options = item">
            {{item}}
        </label><br/>
        <button class="btn btn-info" (click)="submit()">Submit</button>
    `
})

export class RadioMessageComponent {
    message: Message;
    items:string[] = [''];
    model = { options: '' };

    constructor(private liveChatService:LiveChatService) {
        this.message = this.liveChatService.getMessage();
        this.items = this.message.contentData.data;
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = 'User submitted: ' + this.model.options;
        this.message.type = '';
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
