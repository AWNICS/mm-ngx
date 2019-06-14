import { Component, OnInit, Input, ChangeDetectorRef, OnDestroy, EventEmitter, Output } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Create a video message
 * @/export
 * @/class VideoMessageComponent
 */
@Component({
    selector: 'app-video-message',
    template: `
        <video (loadeddata)="emitEvent()" controls *ngIf="url else loading">
            <source [src]="url" type="video/mp4">
            <source [src]="url" type="video/webm">
            Your browser does not support HTML5 video.
            {{ url }}
        </video>
        <ng-template #loading>
                Loading Video...
        </ng-template>
    `,
    styles: [`
        video {
            width: 100% !important;
            height: auto !important;
            max-width: 340px;
        }
    `]
})

export class VideoMessageComponent implements OnInit, OnDestroy {
    @Output() videoLoaded:EventEmitter<any> = new EventEmitter();
    @Input() message: Message;
    url: SafeResourceUrl;
    private unsubscribeObservables = new Subject();

    constructor(private chatService: ChatService, private sanitizer: DomSanitizer, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadVideo(this.message.contentData.data[0]);
        }, 5000);
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }
    emitEvent(){
        this.videoLoaded.emit();
    }

    downloadVideo(fileName: string) {
        this.chatService.downloadFile(fileName)
        .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustUrl(res.result);
                    this.ref.markForCheck();
                };
            });
    }
}
