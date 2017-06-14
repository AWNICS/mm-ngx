import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';
import { DoctorLiveComponent } from './doctor-live.component';

@Component({
    selector: 'mm-checkbox-message',
    template: `
        <p>Select the most suited options below:</p>
        <form [formGroup]="myForm">
            <div *ngFor="let option of options">
                <input type="checkbox" (change)="onChange(option.option, $event.target.checked)"> {{option.option}}<br>
            </div>
            <button (click)="onSubmit(myForm.value);">Submit</button>
        </form>
    `
})

export class CheckBoxMessageComponent implements OnInit, OnDestroy {
    message: Message;
    options = [{option:'Option 1'},{option:'Option 2'}];
    myForm: FormGroup;
    selectedOptions:any;

    constructor(private liveChatService: LiveChatService, private fb: FormBuilder, private doctorLiveComponent: DoctorLiveComponent) {
        this.message = this.liveChatService.getMessage();
    }

    ngOnInit() {
      this.myForm = this.fb.group({
        options: this.fb.array([])
      });
    }

    ngOnDestroy() {
        this.doctorLiveComponent.addReplyMessages('You have selected: ' + this.selectedOptions);
    }

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
      console.log('On submit:' + options.options);
      this.submit(options.options);
      this.selectedOptions = options.options;
    }

    submit(selectedItems:any) {
        console.log('Within the submit: ' + JSON.stringify(selectedItems));
        this.message.contentType = 'text';
        this.message.text = 'Select the most suited options below: ' ;
        this.message.type = 'in';
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
