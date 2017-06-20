import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

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
        <h1>{{title}}</h1>
        <p>{{header}}</p>
        <form [formGroup]="myForm">
            <div *ngFor="let option of options">
                <input type="checkbox" (change)="onChange(option.option, $event.target.checked)"> {{option.option}}<br>
            </div>
            <button type="button" class="btn btn-info" (click)="onSubmit(myForm.value);">Submit</button>
        </form>
    `
})

export class CheckBoxMessageComponent implements OnInit {

    title: string = 'Checkbox Component';
    header: string = '';
    message: Message;
    options = [{ option: 'Option 1' }, { option: 'Option 2' }, { option: 'Option 3' }, { option: 'Option 4' }];
    myForm: FormGroup;
    selectedOptions: any;
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

    constructor(private liveChatService: LiveChatService, private fb: FormBuilder) {
    }

    ngOnInit() {
        this.message = this.liveChatService.getMessage();
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

    addReplyMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        this.newMessage.text = message;
        this.newMessage.picUrl = 'assets/png/female3.png';
        this.newMessage.type = '';
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
                this.messages.push(message);
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
        //console.log('On submit:' + options.options);
        this.submit(options.options);
        this.selectedOptions = options.options;
        this.addReplyMessages('You have selected: ' + this.selectedOptions);
    }

    submit(selectedItems: any) {
        console.log('Within the submit: ' + JSON.stringify(selectedItems));
        this.message.contentType = 'text';
        this.message.text = this.header;
        this.message.type = 'in';
        this.message.responseData.data = selectedItems;
        console.log('Selected options are: ' + this.message.responseData.data);
        this.edit(this.message);
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
