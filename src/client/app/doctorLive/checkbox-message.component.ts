import { Component, OnInit } from '@angular/core';
import { FormsModule,ReactiveFormsModule, FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { Message } from '../shared/database/message';
import { LiveChatService } from './live-chat.service';

@Component({
    selector: 'mm-checkbox-message',
    template: `
        <h1>{{title}}</h1>
        <form>
            <input type="checkbox" name="vehicle1" value="Bike" [(ngModel)]="vehicles.vehicle1">I have a bike
            <input type="checkbox" name="vehicle2" value="Car" [(ngModel)]="vehicles.vehicle2">I have a car
        </form>
        <button class="btn btn-info" (click)="submit()">Submit</button>
    `
})

export class CheckBoxMessageComponent {

    title: string = 'Check box';
    vehicles = {
        vehicle1: 'Bike',
        vehicle2: 'Car'
    };
    message: Message;
    vehicle: string[];

    constructor(private liveChatService:LiveChatService) {
        this.message = this.liveChatService.getMessage();
    }

    submit() {
        if (this.vehicles.vehicle1 === 'Bike') {
            this.vehicle = ['Bike'];
        } else if (this.vehicles.vehicle2 === 'Car') {
            this.vehicle = ['Car'];
        } else {
            this.vehicle = ['Bike', 'Car'];
        }
        this.message.contentType = 'text';
        this.message.text = 'User submitted: ' + this.vehicle;
        this.message.type = '';
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
