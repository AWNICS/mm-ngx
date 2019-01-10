import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { UserDetails } from '../shared/database/user-details';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
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
    private url: string;  // URL to access server

    constructor(
        private http: Http,
        private securityService: SecurityService
    ) {
        this.url = this.securityService.baseUrl;
    }

    login(email: string, password: string): Observable<any> {
        const uri = `${this.url}/login`;
        return this.http.post(uri,{email:email, password: password})
        .map(res => res.json());
    }

    createNewUser(userDetails: UserDetails): Observable<UserDetails | any> {
        const uri = `${this.url}/users`;
        return this.http
            .post(uri, userDetails, this.options)
            .map(response => {
                return response.json() as UserDetails;
            })
            .catch(this.handleError);
    }

    createNewDoctor(doctorProfiles: DoctorProfiles): Observable<DoctorProfiles | any> {
        const url = `${this.url}/doctors`;
        return this.http
            .post(url, doctorProfiles, this.options)
            .map(response => response.json() as DoctorProfiles)
            .catch(this.handleError);
    }

    checkUser(email: string): Observable<any> {
        const url = `${this.url}/resetPassword`;
        return this.http
        .post(url, {email: email}, this.options)
        .map(response => response.json())
        .catch(this.handleError);
    }

    resetPassword(password: string, token: string): Observable<any> {
        const url = `${this.url}/resetPassword/${token}`;
        return this.http
        .put(url, {password: password})
        .map(response => response.json())
        .catch(this.handleError);
    }

    activateUser(token: string): Observable<any> {
        const url = `${this.url}/activates/${token}`;
        return this.http
        .put(url, {activate: 1})
        .map(response => response.json())
        .catch(this.handleError);
    }

    private handleError(error: any): Observable<any> {
        return Observable.throw(error.message || error);
    }
}
