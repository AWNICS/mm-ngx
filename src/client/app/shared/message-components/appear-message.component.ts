import { Component, Input, OnInit } from '@angular/core';

import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';
import { SharedService } from '../services/shared.service';
import { UserDetails } from '../database/user-details';
import { SecurityService } from '../services/security.service';

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
        <a [href]="safeUrl | safe: 'resourceUrl'" target="_blank">
        <button type="button" class="btn btn-secondary" (click)="submit();" [disabled]="!enable">
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
    safeUrl: string;
    @Input() message: Message;
    @Input() index: number;
    @Input() role:String;
    title: string;
    enable = false;
    selectedUser: UserDetails;

    constructor(private socketService: SocketService,
        private sharedService: SharedService,
        private securityService: SecurityService
    ) { }

    ngOnInit() {
        this.title = this.message.text;
        this.safeUrl = this.message.contentData.data[0];
        this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
        if (this.selectedUser.id === this.message.senderId) {
            this.enable = false;
        } else {
            this.enable = true;
        }
    }

    submit() {
        if(this.role==='patient') {
        this.message.contentType = 'text';
        this.message.text = 'Doctor started video consultation.';
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

