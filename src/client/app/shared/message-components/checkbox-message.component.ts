import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';

/**
 * CheckBoxMessageComponent to display check box options
 * @export
 * @class CheckBoxMessageComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
    selector: 'mm-checkbox-message',
    template: `
        <p>{{header}}</p>
        <div class="custom-control custom-checkbox custom-control-inline" *ngFor="let option of options">
            <input type="checkbox" class="custom-control-input" id="{{option}}"
                name="{{option}}"
                value="{{option}}"
                (change)="onSelectionChange($event, option)">
            <label class="custom-control-label" for="{{option}}">{{option}}</label>
        </div>
        <button type="button" class="btn btn-secondary" (click)="submit()">Submit</button>
    `
})

export class CheckBoxMessageComponent implements OnInit {

    @Input() message: Message;
    @Input() public selectedOption: string[] = [];
    @Output() public onNewEntryAdded = new EventEmitter();
    header: string = '';
    options: string[];

    constructor(private socketService: SocketService) {
    }

    ngOnInit() {
        this.options = this.message.contentData.data;
        this.header = this.message.text;
    }

    onSelectionChange(event: any, option: any) {
        if (event.target.checked) {
            this.selectedOption.push(option);
        } else {
            let updateItem = this.selectedOption.find(this.findIndexToUpdate, option);
            let index = this.selectedOption.indexOf(updateItem);
            this.selectedOption.splice(index, 1);
        }
    }

    findIndexToUpdate(option: any) {
        return option === this;
    }

    submit() {
        this.message.contentType = 'text';
        this.message.text = this.header + this.message.contentData.data;
        this.message.responseData.data = this.options;
        this.edit(this.message);
        this.addNewEntry();
    }

    addNewEntry(): void {
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.selectedOption
        });
    }

    edit(message: Message): void {
        let result = JSON.stringify(message);
        if (!result) {
            return;
        }
        this.socketService.updateMessage(message);
    }
}
