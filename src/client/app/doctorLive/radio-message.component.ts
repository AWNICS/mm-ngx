import { Component, OnDestroy } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';
import { DoctorLiveComponent } from './doctor-live.component';

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

export class RadioMessageComponent implements OnDestroy {
    message: Message;
    messages: Message[];
    items:string[] = [''];
    model = { options: '' };

    constructor(private liveChatService:LiveChatService, private doctorLiveComponent: DoctorLiveComponent) {
        this.message = this.liveChatService.getMessage();
        this.items = this.message.contentData.data;
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = 'Select one among the below: ' + this.message.contentData.data;
        this.message.type = 'in';
        this.message.responseData.data = [this.model.options];
        this.edit(this.message);
    }

    ngOnDestroy() {
        this.doctorLiveComponent.addReplyMessages('You have selected: ' +this.model.options);
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
