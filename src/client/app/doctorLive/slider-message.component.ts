import { Component } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

@Component({
    selector: 'mm-slider-message',
    template: `
        <h1>{{title}}</h1>
        <p>Kindly select a number from 0 to 10<small>(0 being the least painful and 10 being the most):</small></p>
        <form>
            <input type="range" name="points" min="0" max="10" [(ngModel)]="points">
            <button class="btn btn-info" (click)="submit();">Submit</button>
        </form>
    `
})

export class SliderMessageComponent {
    title: string = 'Slider Component';
    points:any;
    message: Message;

    constructor(private liveChatService:LiveChatService) {
        this.message = this.liveChatService.getMessage();
        //console.log('From slider component: ' + JSON.stringify(this.message)); For debugging purpose only
    }

    submit() {
        //console.log(this.points); For debugging purpose only
        this.message.contentType = 'text';
        this.message.text = 'User submitted: ' + this.points;
        this.message.type = '';
        this.edit(this.message);
    }

     edit(message: Message): void {
        let result = JSON.stringify(message);
        //console.log('This is from edit: ' + result); For debugging purpose only
        //console.log('The user entered: ' + result);
        // call the web services to update the messages component data
        if (!result) {
            return;
        }
        this.liveChatService.update(this.message)
            .then(() => {
                return null;
            });
        }
}
