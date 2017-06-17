import { Component, OnDestroy } from '@angular/core';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';
import { DoctorLiveComponent } from './doctor-live.component';

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

export class SliderMessageComponent implements OnDestroy {
    title: string = 'Slider Component';
    points:any;
    message: Message;
    header:string;

    constructor(private liveChatService:LiveChatService, private doctorLiveComponent: DoctorLiveComponent) {
        this.message = this.liveChatService.getMessage();
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
    }

    ngOnDestroy() {
        this.doctorLiveComponent.addReplyMessages('You have selected: ' + this.points);
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
