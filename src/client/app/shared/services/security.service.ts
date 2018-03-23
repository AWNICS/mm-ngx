import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

@Injectable()
export class SecurityService {

    private jwt: string;
    private loginStatus = false;

    constructor(private cookieService: CookieService) {
    }

    setToken(token: string) {
        this.jwt = token;
    }

    getToken() {
        return {'Authorization': `${this.jwt}`, 'Key' : `Bearer`};
    }

    setLoginStatus(status: boolean) {
        this.loginStatus = status;
    }
    
    getLoginStatus(){
        return this.loginStatus;
    }

    setCookie(cookie: string) {
        this.cookieService.put('userDetails', JSON.stringify(cookie), { domain: 'localhost' });
    }

    getCookie(){
        return this.cookieService.get('userDetails');
    }

}

