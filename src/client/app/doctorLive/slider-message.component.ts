import { Component } from '@angular/core';

@Component({
    selector: 'mm-slider-message',
    template: `
        <h1>{{title}}</h1>
        <form>
            Points:
            <input type="range" name="points" min="0" max="10" [(ngModel)]="points">
            <button class="btn btn-info" (click)="submit();">Submit</button>
        </form>
    `
})

export class SliderMessageComponent {
    title: string = 'Slider Component';
    points:any;

    submit() {
        console.log(this.points);
    }
}
