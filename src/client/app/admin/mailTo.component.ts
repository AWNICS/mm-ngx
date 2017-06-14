import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';

@Component({
    selector: 'mm-mail',
    template: `
    <a href="mailto:arun.gadag@awnics.com?Subject=Hello" target="_top">{{value}}</a>
    `
})

export class MailToComponent implements OnInit {
    public renderValue:any;

    @Input() value:any;

    ngOnInit() {
        this.renderValue = this.value;
    }
}
