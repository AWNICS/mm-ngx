import { Component, OnInit } from '@angular/core';
import { CookieService } from 'angular2-cookie/services/cookies.service';

import { SocketService } from '../../chat/socket.service';
import { LoginService } from '../../login/login.service';

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
        private loginService: LoginService,
        private cookieService: CookieService) {
}

    ngOnInit(): void {
        this.cookie = this.loginService.getCookie();
        if(this.cookie) {
            this.loggedIn = true;
        }
    }

    logout() {
        this.loginService.setLoginStatus(false);
        this.socketService.logout(JSON.parse(this.cookie).id);
        this.cookieService.remove('userDetails');
    }
}
