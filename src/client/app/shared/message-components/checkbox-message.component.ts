import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctorLive/live-chat.service';

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
        <form [formGroup]="myForm">
            <div *ngFor="let option of options">
                <input type="checkbox" (change)="onChange(option.option, $event.target.checked)"> {{option.option}}<br>
            </div>
            <button type="button" class="btn btn-default" (click)="onSubmit(myForm.value);">Submit</button>
        </form>
    `
})

export class CheckBoxMessageComponent implements OnInit {

    header: string = '';
    @Input() message: Message;
    options = [{ option: 'Option 1' }, { option: 'Option 2' }, { option: 'Option 3' }, { option: 'Option 4' }];
    myForm: FormGroup;
    selectedOptions: any;
    messages: Message[];

    @Input() public responseData: string;
    @Output() public onNewEntryAdded = new EventEmitter();

    constructor(private liveChatService: LiveChatService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.header = this.message.text;
        this.getMessages();
        this.myForm = this.fb.group({
            options: this.fb.array([])
        });
    }

    getMessages() {
        this.liveChatService.getMessages()
            .then(messages => {
                this.messages = messages;
            });
    }

    /**
     * populates the array with the options selected
     * @param {string} option
     * @param {boolean} isChecked
     * @memberof CheckBoxMessageComponent
     */
    onChange(option: string, isChecked: boolean) {
        const optionsFormArray = <FormArray>this.myForm.controls.options;
        if (isChecked) {
            optionsFormArray.push(new FormControl(option));
        } else {
            let index = optionsFormArray.controls.findIndex(x => x.value === option);
            optionsFormArray.removeAt(index);
        }
    }

    onSubmit(options: any) {
        this.selectedOptions = options.options;
        this.message.contentType = 'text';
        this.message.text = this.header;
        this.message.type = 'in';
        this.message.responseData.data = this.selectedOptions;
        this.edit(this.message);
        this.responseData = this.selectedOptions;
        this.addNewEntry();
    }

    addNewEntry(): void {
        this.onNewEntryAdded.emit({
            value: 'You chose: ' + this.responseData
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
