import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';

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
    header: string;
    items: string[] = [''];
    model = { options: '' };
    @Input() public textMessage: string;
    @Output() public onNewEntryAdded = new EventEmitter();

    constructor( private socketService: SocketService ) {
    }

    ngOnInit() {
        this.items = this.message.contentData.data;
        this.header = this.message.text;
    }

    addNewEntry(): void {
        this.textMessage = this.model.options;
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.textMessage
        });
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        this.message.responseData.data = [this.model.options];
        this.edit(this.message);
        this.addNewEntry();
    }

    edit(message: Message): void {
        let result = JSON.stringify(message);
        if (!result) {
            return;
        }
        this.socketService.updateMessage(message);
    }
}
