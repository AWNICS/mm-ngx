import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';

/**
 * TextMessageComponent displays the text from the chat window
 * @export
 * @class TextMessageComponent
 */
@Component({
    selector: 'mm-text-message',
    template: `
            <div id="message">
                {{textMessage}}
                <a style="color:#c7c1c1c7;" *ngIf="linkFound" target="blank" [href]="link">{{link}}</a>
            </div>
    `
})

export class TextMessageComponent implements OnInit {
    @Input() message:Message;
    textMessage:string;
    linkFound:Boolean;
    link:string;

    ngOnInit() {
        let match = this.message.text.match(/https:\/\/\S+/) || this.message.text.match(/http:\/\/\S+/);
        if(match){
            this.linkFound = true;
            this.link = match[0];
            this.textMessage = this.message.text.replace(match[0],'');
        }else{
        this.textMessage = this.message.text;
    }
}
}
