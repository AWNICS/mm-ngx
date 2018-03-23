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

export class NavbarComponent {
    loggedIn: boolean = false;
    cookie: any;

    constructor(private socketService: SocketService,
        private securityService: SecurityService,
        private cookieService: CookieService) {
    }

    ngOnInit(): void {
        this.cookie = this.securityService.getCookie();
        if(this.cookie) {
            this.loggedIn = true;
        }
    }

    logout() {
        this.securityService.setLoginStatus(false);
        console.log('cookie details before: ' + JSON.stringify(this.cookie));
        this.socketService.logout(JSON.parse(this.cookie).id);
        this.cookieService.remove('userDetails', { domain: 'localhost' });
        console.log('cookie details after: ' + JSON.stringify(this.cookie));
    }

    navbarColor(number: number) {
        if(number > 800) {
            document.getElementById('navbar').style.backgroundColor = '#534FFE';
        } else {
            document.getElementById('navbar').style.backgroundColor = '#4696e5';
        }
    }

}
