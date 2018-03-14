import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserDetails } from '../shared/database/user-details';
import { Observable } from 'rxjs/Rx';
import { SecurityService } from '../shared/services/security.service';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://localhost:3000';  // URL to access server

    constructor(private router: Router, private http: Http, private securityService: SecurityService) {
    }

    login(email: string, password: string): Observable<any> {
        const uri = `${this.url}/login`;
        this.headers.append('Authorization', this.securityService.getToken().Authorization);
        return this.http.post(uri,{email:email, password: password}, this.options)
        .map(res => res.json())
        .catch(this.handleError);
    }

    getUserByEmail(email: string): Promise<UserDetails> {
        const uri = `${this.url}/users/${email}`;
        this.headers.append('Authorization', this.securityService.getToken().Authorization);
        return this.http
            .get(uri, this.options).toPromise()
            .then(response => response.json() as UserDetails)
            .catch(this.handleError);
    }

    getUsers(): Promise<UserDetails[]> {
        const uri = `${this.url}/users`;
        this.headers.append('Authorization', this.securityService.getToken().Authorization);
        return this.http
            .get(uri, this.options).toPromise()
            .then(response => response.json().data)
            .catch(this.handleError);
    }

    createNewUser(userDetails: UserDetails): Promise<UserDetails> {
        const uri = `${this.url}/users`;
        this.headers.append('Authorization', this.securityService.getToken().Authorization);
        this.router.navigate(['/login']);
        return this.http
            .post(uri, userDetails, this.options).toPromise()
            .then(response => response.json() as UserDetails)
            .catch(this.handleError);
    }

    update(userDetails: UserDetails): Promise<UserDetails> {
        const uri = `${this.url}/users`;
        this.headers.append('Authorization', this.securityService.getToken().Authorization);
        return this.http
            .put(uri, JSON.stringify(userDetails), { headers: this.headers })
            .toPromise()
            .then(() => userDetails)
            .catch(this.handleError);
    }

    delete(userDetails: UserDetails): Promise<void> {
        const uri = `${this.url}/users/${userDetails.id}`;
        this.headers.append('Authorization', this.securityService.getToken().Authorization);
        return this.http.delete(uri, { headers: this.headers })
            .toPromise()
            .then(() => null)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
