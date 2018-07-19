import { Component, OnInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

import { SocketService } from '../../chat/socket.service';
import { SecurityService } from '../services/security.service';
import { ChatService } from '../../chat/chat.service';
import { UserDetails } from '../database/user-details';

@Component({
    moduleId: module.id,
    selector: 'mm-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit, AfterViewChecked {
    loggedIn: boolean = false;
    user: UserDetails;
    picUrl: string;

    constructor(
        private ref: ChangeDetectorRef,
        private socketService: SocketService,
        private securityService: SecurityService,
        private chatService: ChatService) {
    }

    ngOnInit() {
        this.loggedIn = this.securityService.getLoginStatus();
        if (this.loggedIn === true) {
            this.user = JSON.parse(this.securityService.getCookie('userDetails'));
            if (this.user) {
                this.ref.detectChanges();
                if (this.user.picUrl) {
                    this.downloadPic(this.user.picUrl);
                } else {
                    this.downloadAltPic(this.user.role);
                }
            }
        }
    }

    ngAfterViewChecked() {
        this.loggedIn = this.securityService.getLoginStatus();
    }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.detectChanges();
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
                    this.ref.detectChanges();
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
            document.getElementById('navbar').style.backgroundColor = color;
        } else {
            document.getElementById('navbar').style.backgroundColor = color;
        }
    }

}
