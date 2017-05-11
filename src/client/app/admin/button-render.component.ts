import { Component, OnInit, Input } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    selector: 'mm-button',
    template: `<button (click)='example()'>Click me!</button>`
})

export class ButtonRenderComponent implements OnInit {
    public renderValue:any;
    @Input() value: any;

    ngOnInit() {
        this.renderValue = this.value;
    }

    example() {
        alert(this.renderValue);
    }
}
