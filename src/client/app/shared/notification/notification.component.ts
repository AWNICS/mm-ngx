import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../chat/socket.service';
import { Notification } from '../database/notification';
import { UserDetails } from '../database/user-details';
import { SharedService } from '../services/shared.service';

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

    constructor(private socketService: SocketService, private router: Router, private sharedService: SharedService) {}

    ngOnInit() {
        if(this.selectedUser) {
            this.getNotification();
            this.consultationStatus();
        }
    }

    getNotification() {
        this.socketService.consultNotification()
            .subscribe((data) => {
                if (data) {
                    this.consultationGroupId = data.group[0].id;
                    this.sharedService.setConsultationGroupId(this.consultationGroupId);
                    this.notification = data.notification;
                    this.alert.nativeElement.style.display = 'block';
                }
            });
    }

    dismissNotification() {
        this.alert.nativeElement.style.display = 'none';
    }

    startConsultation(notification: Notification) {
        this.socketService.userAdded(this.selectedUser, this.consultationGroupId, notification);
    }

    consultationStatus() {
        this.socketService.receiveUserAdded()
            .subscribe((response) => {
                this.router.navigate([`/chat/${response.doctorId}`]);
            });
    }
}
