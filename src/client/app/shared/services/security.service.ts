import { Injectable } from '@angular/core';

@Injectable()
export class SecurityService {

    public key = 'Bearer';
    public baseUrl = 'http://localhost:3000';
    private loginStatus = false;

    setLoginStatus(status: boolean) {
        this.loginStatus = status;
    }

    getLoginStatus() {
        return this.loginStatus;
    }

    setCookie(cname: string, cvalue: string, exdays: number) {
        let date = new Date();
        date.setTime(date.getTime() + (exdays*24*60*60*1000));
        let expires = `expires=${date.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    }

    getCookie(cname: string) {
        let name = cname + '=';
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    deleteCookie(cname: string) {
        document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

