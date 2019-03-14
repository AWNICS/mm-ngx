import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable()
export class SecurityService {

    public key = 'Bearer';
    public baseUrl = environment.serviceUrl;
    private loginStatus = false;

    setLoginStatus(status: boolean) {
        this.loginStatus = status;
    }

    getLoginStatus() {
        return this.loginStatus;
    }

    setCookie(cname: string, cvalue: string, exdays: number) {
        const date = new Date();
        date.setTime(date.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    }

    getCookie(cname: string) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                // if there is a valid cookie then set the loginstatus to true so that user's navbar wont changes as if he is loogedout
                this.loginStatus = true;
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    deleteCookie(cname: string) {
        document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

