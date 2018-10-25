import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';
import { SharedService } from '../services/shared.service';

/**
 * appear component to load the appear call in an iframe
 * @export
 * @class AppearMessageComponent
 * @implements {OnInit}
 */
@Component({
    selector: 'mm-appear-message',
    template: `
        <h3>{{title}}</h3>
        <a [href]="safeUrl" target="_blank">
        <button type="button" class="btn btn-secondary" (click)="submit();">
            Start
        </button></a>
    `,
    styles: [`
        #btn {
            color: white;
            background-color: blue;
            margin: 2px;
            padding: 5px;
            text-align: center;
        }
    `]
})

export class AppearMessageComponent implements OnInit {
    @Input() safeUrl: string;
    @Input() message: Message;
    @Input() index: number;
    @Input() role:String;
    title: string;

    constructor(private socketService: SocketService,
        private sharedService: SharedService
    ) { }

    ngOnInit() {
        this.title = this.message.text;
    }

    submit() {
        if(this.role==='patient') {
        this.message.contentType = 'text';
        this.message.text = 'Kindly leave your valuable feedback!';
        this.edit(this.message);
        }
        let audit = {
            senderId: this.message.senderId,
            receiverId: this.message.receiverId,
            receiverType: 'group',
            entityName: 'appear',
            entityEvent: 'started',
            createdBy: this.message.senderId,
            updatedBy: this.message.senderId,
            createdTime: Date.now(),
            updatedTime: Date.now()
        };
        this.createAudit(audit);
    }

    edit(message: Message): void {
        let result = JSON.stringify(message);
        if (!result) {
            return;
        }
        this.socketService.updateMessage(message, this.index);
    }

    createAudit(audit: any) {
        this.sharedService.createAudit(audit)
            .subscribe((res) => {
                return;
            });
    }
}

