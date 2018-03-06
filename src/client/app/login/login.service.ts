import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserDetails } from '../shared/database/user-details';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://localhost:3000/user/controllers';  // URL to access server

    constructor(private router: Router, private http: Http) {
    }

    loggedIn() {
        this.router.navigate(['/logged']);
    }

    loggedOut() {
        this.router.navigate(['/']);
    }

    login(email: string, password: string): Observable<any> {
        const uri = `http://localhost:3000/auth/login`;
        return this.http.post(uri,{email:email, password: password})
        .map(res => res.json())
        .catch(this.handleError);
    }

    getUserByEmail(email: string): Promise<UserDetails> {
        const uri = `${this.url}/findUserByEmail/${email}`;
        return this.http
            .get(uri).toPromise()
            .then(response => response.json() as UserDetails)
            .catch(this.handleError);
    }

    getUsers(): Promise<UserDetails[]> {
        return this.http
            .get(this.url).toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }

    createNewUser(userDetails: UserDetails): Promise<UserDetails> {
        const url = `${this.url}/createUser`;
        this.router.navigate(['/login']);
        return this.http
            .post(url, userDetails, this.options).toPromise()
            .then(response => response.json() as UserDetails)
            .catch(this.handleError);
    }

    update(userDetails: UserDetails): Promise<UserDetails> {
        const url = `${this.url}/putUser`;
        return this.http
            .put(url, JSON.stringify(userDetails), { headers: this.headers })
            .toPromise()
            .then(() => userDetails)
            .catch(this.handleError);
    }

    delete(userDetails: UserDetails): Promise<void> {
        const url = `${this.url}/deleteUser/${userDetails.id}`;
        return this.http.delete(url, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
