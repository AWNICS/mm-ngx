import { Component, OnInit, Input } from '@angular/core';
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

    constructor(private socketService: SocketService) {}

    ngOnInit() {
        this.getNotification();
    }

    getNotification() {
        this.socketService.consultNotification()
            .subscribe((data) => {
                if (data) {
                    this.consultationGroupId = data.group.id;
                    this.notification = data.notification;
                    document.getElementById('alert').style.display = 'block';
                }
            });
    }

    dismissNotification() {
        document.getElementById('alert').style.display = 'none';
    }

    startConsultation() {
        this.socketService.userAdded(this.selectedUser, this.consultationGroupId);
    }
}
