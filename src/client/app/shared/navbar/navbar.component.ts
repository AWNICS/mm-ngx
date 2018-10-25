import { Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { SocketService } from '../../chat/socket.service';
import { SecurityService } from '../services/security.service';
import { ChatService } from '../../chat/chat.service';
import { UserDetails } from '../database/user-details';
import { SharedService } from '../services/shared.service';
import { Notification } from '../database/notification';

@Component({
    moduleId: module.id,
    selector: 'mm-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit, AfterViewInit, AfterViewChecked {
    loggedIn: boolean = false;
    user: UserDetails;
    picUrl: string;
    notifications: Notification[] = [];
    notify = false;
    @ViewChild('navbar') navbar: ElementRef;

    constructor(
        private ref: ChangeDetectorRef,
        private socketService: SocketService,
        private securityService: SecurityService,
        private sharedService: SharedService,
        private chatService: ChatService,
        private router: Router) {
    }

    ngOnInit() {
        this.loggedIn = this.securityService.getLoginStatus();
        if (this.loggedIn === true) {
            this.user = JSON.parse(this.securityService.getCookie('userDetails'));
            if (this.user) {
                this.getNotifications(this.user);
                this.getLatestNotification();
                this.consultationStatus();
                if (this.user.picUrl) {
                    this.downloadPic(this.user.picUrl);
                } else {
                    this.downloadAltPic(this.user.role);
                }
            }
        }
    }

    ngAfterViewInit() {
        this.checkWindowVisibility();
    }

    ngAfterViewChecked() {
        this.loggedIn = this.securityService.getLoginStatus();
    }

    checkWindowVisibility() {
        window.addEventListener('focus',()=> {
            this.sharedService.setWindowVisibility(false);
        });
        window.addEventListener('blur',()=> {
            this.sharedService.setWindowVisibility(true);
        });
    }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.markForCheck();
                };
            });
    }

    downloadAltPic(role: string) {
        let fileName: string;
        if (role === 'bot') {
            fileName = 'bot.jpg';
        } else if (role === 'doctor') {
            fileName = 'doc.png';
        } else {
            fileName = 'user.png';
        }
        this.chatService.downloadFile(fileName)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.markForCheck();
                };
            });
    }

    logout() {
        this.securityService.setLoginStatus(false);
        this.socketService.logout(this.user.id);
        this.securityService.deleteCookie('userDetails');
        this.securityService.deleteCookie('token');
    }

    navbarColor(number: number, color: string) {
        if (number > 800) {
            this.navbar.nativeElement.style.backgroundColor = color;
        } else {
            this.navbar.nativeElement.style.backgroundColor = color;
        }
    }

    getNotifications(user: UserDetails) {
        let page = 1;
        let size = 10;
        this.sharedService.getNotificationsByUserId(user.id, page, size)
            .subscribe((notifications) => {
                if (notifications.length >= 1) {
                    this.notify = true;
                    this.notifications = notifications;
                    this.ref.detectChanges();
                }
            });
    }

    startConsultation(notification: Notification) {
        this.socketService.userAdded(this.user, notification);
    }

    getLatestNotification() {
        this.socketService.consultNotification()
            .subscribe((data) => {
                if (data) {
                    this.notifications.push(data.notification);
                }
            });
    }

    consultationStatus() {
        this.socketService.receiveUserAdded()
            .subscribe((response) => {
                this.getNotifications(this.user);
                this.router.navigate([`/chat/${response.doctorId}`]);
            });
    }

}
