import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * ImageMessageComponent to display image
 * @//export
 * @//class ImageMessageComponent
 */
@Component({
    selector: 'app-image-message',
    templateUrl: 'image-message.component.html',
    styleUrls: ['image-message.component.css']
})

export class ImageMessageComponent implements OnInit, OnDestroy {

    @Input() message: Message;
    @ViewChild('modal') modal: ElementRef;
    @Input() imageUrl;
    @Input() top;
    @Input() left;
    @Output() imageFullUrl = new EventEmitter();
    thumbImageUrl: SafeResourceUrl;
    fullImageUrl: SafeResourceUrl;
    imageName: string;
    chatMode: Boolean;
    private unsubscribeObservables = new Subject();

    constructor(private chatService: ChatService, private sanitizer: DomSanitizer, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        setTimeout(() => {
            this.message ? this.downloadThumbImage(this.message.contentData.data[0]) : this.downloadThumbImage(this.imageUrl);
            this.message ? this.chatMode = true : this.chatMode = false;
        }, 5000);
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    downloadThumbImage(imageName: any) {
        if(imageName){
            this.imageName = imageName;
            this.chatService.downloadFile(imageName)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((res) => {
                    res.onloadend = () => {
                        this.thumbImageUrl = res.result;
                        this.ref.markForCheck();
                    };
                });
        } else {
            console.log('hit');
            this.thumbImageUrl = '';
            this.ref.markForCheck();
        }
    }

    downloadFullImage(imageName: string) {
        if(imageName){
            imageName = imageName.replace('-thumb', '');
            this.chatService.downloadFile(imageName)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((res) => {
                    res.onloadend = () => {
                        console.log(this.fullImageUrl);
                        this.fullImageUrl = res.result;
                        this.ref.markForCheck();
                    };
                });
        } else {
            this.fullImageUrl = '';
        }
    }

    openModal() {
        if(this.message){
        this.downloadFullImage(this.imageName);
        this.modal.nativeElement.style.display = 'block';
        } else {
            this.imageFullUrl.emit('click');
        }
      }

      closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }
}
