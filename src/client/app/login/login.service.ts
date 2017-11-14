import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

//import { OrderRequest } from '../shared/database/orderRequest';

@Injectable()
export class LoginService {

    constructor(private router: Router) {
   }

    loggedIn() {
        this.router.navigate(['/logged']);
    }

    loggedOut() {
        this.router.navigate(['/']);
    }

    registered() {
        this.router.navigate(['/login']);
    }
}
