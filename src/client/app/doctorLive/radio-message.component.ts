import { Component } from '@angular/core';

@Component({
    selector: 'mm-radio-message',
    template: `
        <label *ngFor="let item of radioItems">
            <input type="radio" name="options" (click)="model.options = item">
            {{item}}
        </label><br/>
        <button class="btn btn-info" (click)="submit()">Submit</button>
    `
})

export class RadioMessageComponent {
    items = 'one two three four';
    radioItems = this.items.split(' ');
    model = { options: '' };

    submit() {
        console.log(JSON.stringify(this.model));
    }
}
