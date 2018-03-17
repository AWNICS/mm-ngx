import { Injectable } from '@angular/core';

@Injectable()
export class SecurityService {

    private jwt: string;

    constructor() {
    }

    setToken(token: string) {
        this.jwt = token;
    }

    getToken() {
        return {'Authorization': `Bearer ${this.jwt}`};
    }

}

