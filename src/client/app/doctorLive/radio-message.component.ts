import { Component, OnDestroy } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';
import { DoctorLiveComponent } from './doctor-live.component';

/**
 * RadioMessageComponent to display the radio message
 * @export
 * @class RadioMessageComponent
 * @implements {OnDestroy}
 */
@Component({
    selector: 'mm-radio-message',
    template: `
        <h1>{{title}}</h1>
        <p>{{header}}</p>
        <label *ngFor="let item of items">
            <input type="radio" name="options" (click)="model.options = item">
            {{item}}
        </label><br/>
        <button class="btn btn-info" (click)="submit()">Submit</button>
    `
})

export class RadioMessageComponent implements OnDestroy {
    title: string = 'Radio Component';
    message: Message;
    messages: Message[];
    header:string;
    items:string[] = [''];
    model = { options: '' };

    constructor(private liveChatService:LiveChatService, private doctorLiveComponent: DoctorLiveComponent) {
        this.message = this.liveChatService.getMessage();
        this.items = this.message.contentData.data;
        this.header = this.message.text;
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        this.message.type = 'in';
        this.message.responseData.data = [this.model.options];
        this.edit(this.message);
    }

    ngOnDestroy() {
        this.doctorLiveComponent.addReplyMessages('You have selected: ' + this.model.options);
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
