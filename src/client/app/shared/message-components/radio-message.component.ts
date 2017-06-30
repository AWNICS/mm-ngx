import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

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
        <button type="button" class="btn btn-info" (click)="submit()">Submit</button>
    `
})

export class RadioMessageComponent implements OnInit {
    title: string = 'Radio Component';
    message: Message;
    messages: Message[];
    header:string;
    items:string[] = [''];
    model = { options: '' };
    @Input() public responseData:string;
    @Output() public onNewEntryAdded = new EventEmitter();

    constructor(private liveChatService:LiveChatService) {
    }

    ngOnInit() {
        this.getMessages();
        this.message = this.liveChatService.getMessage();
        this.items = this.message.contentData.data;
        this.header = this.message.text;
    }

    addNewEntry(): void {
        this.responseData = this.model.options;
        this.onNewEntryAdded.emit({
            value: this.responseData
        });
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        this.message.type = 'in';
        this.message.responseData.data = [this.model.options];
        this.edit(this.message);
        this.addNewEntry();
    }

    getMessages() {
         this.liveChatService.getMessages()
         .then(messages => {
             this.messages = messages;
         });
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
