import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserDetails } from '../shared/database/user-details';
import { DoctorDetails } from '../shared/database/doctor-details';
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

    constructor(
        private router: Router,
        private http: Http,
        private securityService: SecurityService
    ) {
    }

    login(email: string, password: string): Observable<any> {
        const uri = `${this.url}/login`;
        return this.http.post(uri,{email:email, password: password})
        .map(res => res.json())
        .catch(this.handleError);
    }

    createNewUser(userDetails: UserDetails): Promise<UserDetails> {
        const uri = `${this.url}/users`;
        this.headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .post(uri, userDetails, this.options).toPromise()
            .then(response => {
                this.router.navigate(['/login']);
                return response.json() as UserDetails;
            })
            .catch(this.handleError);
    }

    createNewDoctor(doctorDetails: DoctorDetails): Promise<DoctorDetails> {
        const url = `${this.url}/doctors`;
        return this.http
            .post(url, doctorDetails, this.options).toPromise()
            .then(response => response.json() as DoctorDetails)
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        return Promise.reject(error.message || error);
    }
}
