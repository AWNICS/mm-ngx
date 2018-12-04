import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { DomSanitizer, SafeHtml, SafeStyle, SafeScript, SafeUrl, SafeResourceUrl } from '@angular/platform-browser';


/**
 * TextMessageComponent displays the text from the chat window
 * @export
 * @class TextMessageComponent
 */
@Component({
    selector: 'mm-text-message',
    template: `
            <div *ngIf="!youtubeLink" id="message">
                {{textMessage}}
                <a style="color:#c7c1c1c7;text-transform:none" *ngIf="linkFound" target="blank" [href]="link">{{link}}</a>
            </div>
            <div id="message" >
            <iframe id="ytplayer" style="width:100%;height:200px"
            *ngIf="youtubeLink" type="text/html"
              [src]="youtubeLink | safe : 'resourceUrl'"
            frameborder="2" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            </div>
    `
})

export class TextMessageComponent implements OnInit {
    @Input() message:Message;
    textMessage:string;
    linkFound:Boolean;
    link:string;
    youtubeLink:SafeUrl;
    constructor(public sanitizer: DomSanitizer) {}
    ngOnInit() {
        if(this.message.text) {
        let youtubeMatch = this.message.text.match(/https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9-]+)/) ||
        this.message.text.match(/http:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9-]+)/);
        if(youtubeMatch) {
            this.youtubeLink = 'https://www.youtube.com/embed/'+youtubeMatch[1]+'?fs=1';
        } else {
        let match = this.message.text.match(/https:\/\/\S+/) || this.message.text.match(/http:\/\/\S+/);
        if(match) {
            this.linkFound = true;
            this.link = match[0];
            this.textMessage = this.message.text.replace(match[0],'');
        } else {
            this.linkFound = false;
            this.textMessage = this.message.text;
    }}
}
    }
}
