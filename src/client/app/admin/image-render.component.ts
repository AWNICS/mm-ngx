import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { UploadModalComponent } from './upload-modal.component';

@Component({
    selector: 'mm-image',
    template: `
    <img [src]='renderValue' width='100' height='100' alt="Image not available"/>
    <button style="margin: 2px; padding: 2px;" (click)="openAlert()">Upload</button>
    <mm-upload-modal></mm-upload-modal>`
})

export class ImageRenderComponent implements OnInit {
    public renderValue:any;

    @Input() value:any;
    @ViewChild(UploadModalComponent)
    modalhtml: UploadModalComponent;


    ngOnInit() {
        this.renderValue = this.value;
    }

    openAlert() {
        this.modalhtml.open('lg');
    }
}
