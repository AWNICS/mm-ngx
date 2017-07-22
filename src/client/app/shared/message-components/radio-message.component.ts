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
        <p>{{header}}</p>
        <label *ngFor="let item of items" class="custom-control custom-radio">
            <input type="radio" class="custom-control-input" name="options" (click)="model.options = item">
            <span class="custom-control-indicator"></span>
            <span class="custom-control-description">
                {{item}}
            </span>
        </label><br/>
        <button type="button" class="btn btn-secondary" (click)="submit()">Submit</button>
    `
})

export class RadioMessageComponent implements OnInit {
    @Input() message: Message;
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
        //this.message = this.liveChatService.getMessage();
        this.items = this.message.contentData.data;
        this.header = this.message.text;
    }

    addNewEntry(): void {
        this.responseData = this.model.options;
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.responseData
        });
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        if(this.message.type === 'in') {
            this.message.type = 'in';
        } else {
            this.message.type = 'out';
        }
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
