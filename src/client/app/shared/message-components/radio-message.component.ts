import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';
import { ChatService } from '../../chat/chat.service';
import { UserDetails } from '../database/user-details';

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
    <div class="custom-control custom-radio custom-control-inline" *ngFor="let option of options; let idx=index">
        <input type="radio" id="{{option}}" name="radiogroup" class="custom-control-input"
        [checked]="idx === 0"
        [value]="option"
        (change)="onSelectionChange(option);" />
        <label class="custom-control-label" for="{{option}}">{{option}}</label>
    </div>
    <button type="button" [disabled]="!enable" class="btn btn-secondary" (click)="submit()">Submit</button>
    `
})

export class RadioMessageComponent implements OnInit {

    @Input() message: Message;
    @Input() public selectedOption: string;
    @Output() public onNewEntryAdded = new EventEmitter();
    header: string;
    options: string[];
    selectedUser: UserDetails;
    enable: boolean = true;

    constructor( private socketService: SocketService, private chatService: ChatService ) {
    }

    ngOnInit() {
        this.options = this.message.contentData.data;
        this.header = this.message.text;
        /*this.selectedUser = this.chatService.getUser();
        if(this.selectedUser.id === this.message.senderId) {
            this.enable = false;
        } else {
            this.enable = true;
        }*/
    }

    onSelectionChange(option:string) {
        this.selectedOption = option;
    }

    addNewEntry(): void {
        console.log('Selected option is: ', this.selectedOption);
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.selectedOption
        });
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        this.message.responseData.data = this.options;
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
