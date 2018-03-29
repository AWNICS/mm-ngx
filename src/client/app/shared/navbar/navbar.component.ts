import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie';

import { SocketService } from '../../chat/socket.service';
import { SecurityService } from '../services/security.service';

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
        private securityService: SecurityService,
        private cookieService: CookieService) {
    }

    ngOnInit(): void {
        this.user = this.securityService.getUser();
        if(this.user) {
            this.loggedIn = true;
            this.picUrl = JSON.parse(this.user).picUrl;
        }
    }

    logout() {
        this.securityService.setLoginStatus(false);
        this.socketService.logout(JSON.parse(this.user).id);
        this.cookieService.remove('userDetails', { domain: 'localhost' });
        this.cookieService.remove('token', { domain: 'localhost' });
    }

    navbarColor(number: number, color: string) {
        if(number > 800) {
            document.getElementById('navbar').style.backgroundColor = color;
        } else {
            document.getElementById('navbar').style.backgroundColor = color;
        }
    }

}
