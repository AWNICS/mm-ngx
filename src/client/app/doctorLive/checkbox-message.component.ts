import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';
import { DoctorLiveComponent } from './doctor-live.component';

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

export class CheckBoxMessageComponent implements OnInit, OnDestroy {

    title:string = 'Checkbox Component';
    header:string = '';
    message: Message;
    options = [{option: 'Option 1'}, {option: 'Option 2'}, {option: 'Option 3'}, {option: 'Option 4'}];
    myForm: FormGroup;
    selectedOptions:any;

    constructor(private liveChatService: LiveChatService, private fb: FormBuilder, private doctorLiveComponent: DoctorLiveComponent) {
        this.message = this.liveChatService.getMessage();
        this.header = this.message.text;
    }

    ngOnInit() {
      this.myForm = this.fb.group({
        options: this.fb.array([])
      });
    }

    /**
     * creates a new text message on destroying the component
     * @memberof CheckBoxMessageComponent
     */
    ngOnDestroy() {
        this.doctorLiveComponent.addReplyMessages('You have selected: ' + this.selectedOptions);
    }

    /**
     * populates the array with the options selected
     * @param {string} option
     * @param {boolean} isChecked
     * @memberof CheckBoxMessageComponent
     */
    onChange(option:string, isChecked: boolean) {
      const optionsFormArray = <FormArray>this.myForm.controls.options;
      if(isChecked) {
        optionsFormArray.push(new FormControl(option));
      } else {
        let index = optionsFormArray.controls.findIndex(x => x.value === option);
        optionsFormArray.removeAt(index);
      }
  }

    onSubmit(options:any) {
      //console.log('On submit:' + options.options);
      this.submit(options.options);
      this.selectedOptions = options.options;
    }

    submit(selectedItems:any) {
        console.log('Within the submit: ' + JSON.stringify(selectedItems));
        this.message.contentType = 'text';
        this.message.text = this.header ;
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
