import { Component, OnInit } from '@angular/core';
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
    newMessage: Message = {
        user: '',
        id: null,
        text: '',
        picUrl: '',
        lastUpdateTime: '',
        type: '',
        status: '',
        contentType: 'text',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        }
    };

    constructor(private liveChatService:LiveChatService) {
    }

    ngOnInit() {
        this.getMessages();
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
        this.addReplyMessages('You have selected: ' + this.model.options);
    }

    getMessages() {
         this.liveChatService.getMessages()
         .then(messages => {
             this.messages = messages;
         });
     }

    addReplyMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        this.newMessage.text= message;
        this.newMessage.picUrl = 'assets/png/female3.png';
        this.newMessage.type = '';
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
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
