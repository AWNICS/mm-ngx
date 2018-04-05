import { Injectable } from '@angular/core';
import { UserDetails } from '../database/user-details';

@Injectable()
export class SecurityService {

    key = 'Bearer';
    private jwt: string;
    private loginStatus = false;

    constructor() {
    }

    setLoginStatus(status: boolean) {
        this.loginStatus = status;
    }

    getLoginStatus() {
        return this.loginStatus;
    }

    setCookie(cname: string, cvalue: string, exdays: number) {
        var date = new Date();
        date.setTime(date.getTime() + (exdays*24*60*60*1000));
        var expires = `expires=${date.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};path=/`;
    }

    getCookie(cname: string) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    deleteCookie(cname: string) {
        document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
}

