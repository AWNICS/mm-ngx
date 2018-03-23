import { Injectable } from '@angular/core';

@Injectable()
export class SecurityService {

    private jwt: string;

    setToken(token: string) {
        this.jwt = token;
    }

    getToken() {
        return {'Authorization': `${this.jwt}`, 'Key' : `Bearer`};
    }

}

