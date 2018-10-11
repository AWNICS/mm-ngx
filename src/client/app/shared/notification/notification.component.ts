import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { SocketService } from '../../chat/socket.service';
import { Notification } from '../database/notification';
import { UserDetails } from '../database/user-details';

@Component({
    moduleId: module.id,
    selector: 'mm-notification',
    templateUrl: 'notification.component.html',
    styleUrls: ['notification.component.css']
})

export class NotificationComponent implements OnInit {

    consultationGroupId: number;
    notification: Notification;
    @Input() selectedUser: UserDetails;
    @ViewChild('alert') alert: ElementRef;

    constructor(private socketService: SocketService) {}

    ngOnInit() {
        if(this.selectedUser) {
            this.getNotification();
        }
    }

    getNotification() {
        this.socketService.consultNotification()
            .subscribe((data) => {
                if (data) {
                    this.consultationGroupId = data.group.id;
                    this.notification = data.notification;
                    this.alert.nativeElement.style.display = 'block';
                }
            });
    }

    dismissNotification() {
        this.alert.nativeElement.style.display = 'none';
    }

    startConsultation() {
        this.socketService.userAdded(this.selectedUser, this.consultationGroupId);
    }
}
