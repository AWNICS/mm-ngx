import { Component, OnInit, Input, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Message } from '../database/message';
import { ChatService } from '../../chat/chat.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

/**
 * ImageMessageComponent to display image
 * @export
 * @class ImageMessageComponent
 */
@Component({
    moduleId: module.id,
    selector: 'mm-image-message',
    templateUrl: 'image-message.component.html',
    styleUrls: ['image-message.component.css']
})

export class ImageMessageComponent implements OnInit {

    @Input() message: Message;
    @ViewChild('modal') modal: ElementRef;
    url: SafeResourceUrl;

    constructor(private chatService: ChatService, private sanitizer: DomSanitizer, private ref: ChangeDetectorRef) { }

    ngOnInit() {
        setTimeout(() => {
            this.downloadImage(this.message.contentData.data[0]);
        }, 5000);
    }

    downloadImage(fileName: string) {
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = this.sanitizer.bypassSecurityTrustUrl(res.result);
                    this.ref.markForCheck();
                };
            });
    }

    openModal() {
        this.modal.nativeElement.style.display = 'block';
      }

      closeModal() {
        this.modal.nativeElement.style.display = 'none';
    }
}
