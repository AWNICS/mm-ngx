import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

    submit() {
        console.log(JSON.stringify(this.vehicles));
    }
}
