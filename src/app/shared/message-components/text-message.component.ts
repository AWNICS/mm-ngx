import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';


/**
 * TextMessageComponent displays the text from the chat window
 * @/export
 * @/class TextMessageComponent
 */
@Component({
    selector: 'app-text-message',
    template: `
            <div *ngIf="!youtubeLink" id="message" [ngStyle]="{'white-space': message.info ? 'pre-line':'unset'}">
                {{ textMessage }}
                <a style="color:#c7c1c1c7;text-transform:none" *ngIf="linkFound" target="blank" [href]="link">{{ link }}</a>
            </div>
            <div id="message" >
            <iframe id="ytplayer" style="max-width:100%;min-height:200px;max-height:300px"
            *ngIf="youtubeLink" type="text/html"
              [src]="youtubeLink | safe : 'resourceUrl'"
            frameborder="2" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
    `
})

export class TextMessageComponent implements OnInit {
    @Input() message: Message;
    textMessage: string;
    linkFound: Boolean;
    link: string;
    youtubeLink: SafeUrl;
    constructor(public sanitizer: DomSanitizer) {}
    ngOnInit() {
        if (this.message.text) {
        const youtubeMatch = this.message.text.match(/https:\/\/www.youtube.com\/watch\?v=(\S+)/) ||
        this.message.text.match(/http:\/\/www.youtube.com\/watch\?v=(\S+)/);
        if (youtubeMatch) {
            this.youtubeLink = 'https://www.youtube.com/embed/' + youtubeMatch[1] + '?fs=1';
        } else {
        const match = this.message.text.match(/https:\/\/\S+/) || this.message.text.match(/http:\/\/\S+/);
        if (match) {
            this.linkFound = true;
            this.link = match[0];
            this.textMessage = this.message.text.replace(match[0], '');
        } else {
            this.linkFound = false;
            this.textMessage = this.message.text;
    }}
}
    }
}
