import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs/Subject';

/**
 * Create a document message
 * @export
 * @class DocumentMessageComponent
 */
@Component({
    selector: 'mm-document-message',
    template: `
    <div *ngIf="url; else loading">
        <a [href]="url" *ngIf="!toggleFileName" download="{{fileName}}">{{fileName}}</a>
        <a i18n class="button button__accent" [href]="url" *ngIf="toggleFileName" download="{{fileName}}">
        Download Prescription</a>
    </div>
    <ng-template #loading>
        Downloading PDF ...
    </ng-template>
    `,
    styles: [`
    a {
        color:#000000;
    }
    button,
    .button {
        display: inline-block;
        padding: 3pt 8pt;
        line-height: 1.5;
        border: 1px solid #6C63FF;
        color: #6C63FF;
        font-weight: 400;
        transition: 0.7s;
        white-space: nowrap;
        cursor: pointer;
        background-color: transparent;
        border-radius: 30px;
        transition: 0.7s;
        text-align: center;
        text-decoration: none;
        font-family: Lato, sans-serif;
        font-size: 15px;
    }

    button:hover,
    button:focus,
    .button:hover,
    .button:focus {
        outline: none;
    }
    .button__accent {
        background-color: #06d19c;
        border-color: #06d19c;
        color: #fff;
        margin-right: 2%;
    }
    @media (max-width: 575.98px) {
        .button {
            font-size: 7px
        }
    }
    `]
})

export class DocumentMessageComponent implements OnInit, OnDestroy {

    @Input() message: Message;
    url: SafeResourceUrl;
    fileName: string;
    toggleFileName:Boolean = false;
    private unsubscribeObservables = new Subject();

    constructor(
        private chatService: ChatService,
        private sanitizer: DomSanitizer,
        private ref: ChangeDetectorRef
        ) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadDoc(this.message.contentData.data[0]);
            this.fileName = this.message.contentData.data[0];
        }, 5000);
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    downloadDoc(fileName: string) {
        fileName.match(/\d+-\d\d-\d\d-[0-9]{4}T\d\d-\d\d-\d\d-[0-9]{3}\.pdf$/i)?this.toggleFileName = true:this.toggleFileName = false;
        this.chatService.downloadFile(fileName)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustResourceUrl(res.result);
                    this.ref.markForCheck();
                };
            });
    }
}
