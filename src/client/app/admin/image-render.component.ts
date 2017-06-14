import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { UploadModalComponent } from './upload-modal.component';

@Component({
    selector: 'mm-image',
    template: `
    <div class="container" (click)="openModal()">
        <img [src]='renderValue' class="image" (click)="openModal()" alt="Image not available"/>
        <div class="overlay">
            <div class="text">Upload New</div>
        </div>
    </div>
    <mm-upload-modal></mm-upload-modal>`,
    styles: [`
        .container {
            position: relative;
            width: 100%;
            height: auto;
        }

        .image {
            display: block;
            width: 100px;
            height: auto;
        }

        .overlay {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            height: 100%;
            width: 100%;
            opacity: 0;
            transition: .5s ease;
            background-color: #008CBA;
            cursor: pointer;
        }

        .container:hover .overlay {
            opacity: 0.9;
        }

        .text {
            color: white;
            font-size: 20px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
        }
    `]
})

export class ImageRenderComponent implements OnInit {
    public renderValue:any;

    @Input() value:any;
    @ViewChild(UploadModalComponent)
    modalhtml: UploadModalComponent;

    ngOnInit() {
        this.renderValue = this.value;
    }

    openModal() {
        this.modalhtml.open('lg');
    }
}
