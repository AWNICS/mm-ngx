import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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

    constructor(private socketService: SocketService, private router: Router) {}

    ngOnInit() {
        if(this.selectedUser) {
            console.log('selected user ', this.selectedUser);
            this.getNotification();
        }
    }

    getNotification() {
        this.socketService.consultNotification()
            .subscribe((data) => {
                if (data) {
                    console.log('notification ', data);
                    this.consultationGroupId = data.group[0].id;
                    this.notification = data.notification;
                    this.alert.nativeElement.style.display = 'block';
                    this.consultationStatus();
                }
            });
    }

    dismissNotification() {
        this.alert.nativeElement.style.display = 'none';
    }

    startConsultation() {
        this.socketService.userAdded(this.selectedUser, this.consultationGroupId);
    }

    consultationStatus() {
        this.socketService.receiveUserAdded()
            .subscribe((response) => {
                console.log('notification component consultation status ', response);
                this.router.navigate([`/chat/${response.doctorId}`]);
            });
    }
}
