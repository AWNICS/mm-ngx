import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { Message } from '../database/message';
import { SocketService } from '../../chat/socket.service';
import { SharedService } from '../services/shared.service';
import { UserDetails } from '../database/user-details';
import { SecurityService } from '../services/security.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * appear component to load the appear call in an iframe
 * @/export
 * @/class AppearMessageComponent
 * @/implements {OnInit}
 */
@Component({
    selector: 'app-appear-message',
    template: `
        <h3>{{ title }}</h3>
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

export class AppearMessageComponent implements OnInit, OnDestroy {
    safeUrl: string;
    @Input() message: Message;
    @Input() index: number;
    title: string;
    enable = false;
    selectedUser: UserDetails;
    private unsubscribeObservables = new Subject();

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

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    submit() {
        if (this.selectedUser.role === 'patient') {
        this.message.contentType = 'text';
        this.message.text = 'Doctor started video consultation.';
        this.edit(this.message);
        }
        const audit = {
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
        const result = JSON.stringify(message);
        if (!result) {
            return;
        }
        this.socketService.updateMessage(message, this.index);
    }

    createAudit(audit: any) {
        this.sharedService.createAudit(audit)
        .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                return;
            });
    }
}

