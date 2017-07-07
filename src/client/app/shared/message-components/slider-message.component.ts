import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
    @Input() message: Message;
    header:string;
    messages: Message[];
    @Input() public responseData:string;
    @Output() public onNewEntryAdded = new EventEmitter();

    constructor(private liveChatService:LiveChatService) {
    }

    ngOnInit() {
        this.getMessages();
        this.header = this.message.text;
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
        this.responseData = this.points;
        this.addNewEntry();
    }

    addNewEntry(): void {
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.responseData
        });
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
