import { Component, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

/**
 * Slider component in live chat
 * @export
 * @class SliderMessageComponent
 * @implements {OnDestroy}
 */
@Component({
    selector: 'mm-slider-message',
    template: `
        <h1>{{title}}</h1>
        <p>{{header}}</p>
        <form>
            <input type="range" name="points" min="0" max="10" [(ngModel)]="points">
            <button type="button" class="btn btn-info" (click)="submit();">Submit</button>
        </form>
    `
})

export class SliderMessageComponent implements OnInit {
    title: string = 'Slider Component';
    points:any;
    message: Message;
    header:string;
    messages: Message[];
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

    /**
     * function to edit the message being displayed onSubmit()
     * @memberof SliderMessageComponent
     */
    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header;
        this.message.type = 'in';
        this.message.responseData.data = this.points;
        this.edit(this.message);
        this.addReplyMessages('You have selected: ' + this.points);
    }

    ngOnInit() {
        this.getMessages();
        this.message = this.liveChatService.getMessage();
        this.header = this.message.text;
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
