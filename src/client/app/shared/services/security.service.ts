import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { UserDetails } from '../database/user-details';

@Injectable()
export class SecurityService {

    key = 'Bearer';
    private jwt: string;
    private loginStatus = false;

    constructor(private cookieService: CookieService) {
    }

    setLoginStatus(status: boolean) {
        this.loginStatus = status;
    }

    getLoginStatus() {
        return this.loginStatus;
    }

    setToken(token: string) {
        this.cookieService.put('token', token, { domain: 'localhost'});
    }

    getToken() {
        return this.cookieService.get('token');
    }

    setUser(user: UserDetails) {
        this.cookieService.put('userDetails', JSON.stringify(user), { domain: 'localhost' });
    }

    getUser() {
        return this.cookieService.get('userDetails');
    }

}

