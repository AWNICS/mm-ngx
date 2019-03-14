/*import { Component, Input, OnInit } from '@angular/core';
import { Message } from '../database/message';
import { LiveChatService } from '../../doctor-live/live-chat.service';

/**
 * AlertMessageComponent displays the text from the chat window
 * @export
 * @class AlertMessageComponent
 */
/*@Component({
    selector: 'mm-alert-message',
    template: `
            <div>
                {{alertMessage}}
                <button type="button" class="btn btn-secondary" (click)="onClickClose()">
                    <i class="fa fa-times" aria-hidden="true"></i>
                </button>
            </div>
    `,
    styles: [`
        button {
            background-color:none;
            border:none;
        }
    `]
})

export class AlertMessageComponent implements OnInit {
    @Input() message:Message;
    alertMessage:string;

    constructor(private liveChatService: LiveChatService) { }

    ngOnInit() {
        this.alertMessage = this.message.text;
    }

     onClickClose() {
         this.message.type = '';
         this.edit();
     }

    edit(): void {
        let result = JSON.stringify(this.message);
        //console.log(result); // for debug only
        this.liveChatService.update(this.message)
            .then(() => {
                return null;
            });
    }
}*/
