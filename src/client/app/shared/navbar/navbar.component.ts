import { Component, OnInit } from '@angular/core';

import { SocketService } from '../../chat/socket.service';
import { SecurityService } from '../services/security.service';
import { UserDetails } from '../database/user-details';

@Component({
    moduleId: module.id,
    selector: 'mm-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit {
    loggedIn: boolean = false;
    user: any;
    picUrl: string;

    constructor(private socketService: SocketService,
        private securityService: SecurityService) {
    }

    ngOnInit(): void {
        this.user = this.securityService.getCookie('userDetails');
        if(this.user) {
            this.loggedIn = this.securityService.getLoginStatus();
            this.picUrl = JSON.parse(this.user).picUrl;
        }
    }

    logout() {
        this.securityService.setLoginStatus(false);
        this.socketService.logout(JSON.parse(this.user).id);
        this.securityService.deleteCookie('userDetails');
        this.securityService.deleteCookie('token');
    }

    navbarColor(number: number, color: string) {
        if(number > 800) {
            document.getElementById('navbar').style.backgroundColor = color;
        } else {
            document.getElementById('navbar').style.backgroundColor = color;
        }
    }

}
