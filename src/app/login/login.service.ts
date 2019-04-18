import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams } from '@angular/common/http';
import { UserDetails } from '../shared/database/user-details';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SecurityService } from '../shared/services/security.service';

// Import RxJs required methods
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/catch';

@Injectable()
export class LoginService {

    private httpOptions = {
        headers : new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    // private httpOptions = new RequestOptions({ headers: this.headers }); // Create a request option
    private url: string;  // URL to access server

    constructor(
        private http: HttpClient,
        private securityService: SecurityService
    ) {
        this.url = this.securityService.baseUrl;
    }

    login(email: string, password: string): Observable<any> {
        const uri = `${this.url}/login`;
        return this.http.post(uri, {email: email, password: password}, this.httpOptions)
        .pipe(map((res: any) => res ));
    }

    createNewUser(userDetails: UserDetails): Observable<UserDetails | any> {
        const uri = `${this.url}/users`;
        return this.http
            .post(uri, userDetails, this.httpOptions)
            .pipe(map((res: any) =>  res as DoctorProfiles ),
               catchError(this.handleError));
    }

    createNewDoctor(doctorProfiles: DoctorProfiles): Observable<DoctorProfiles | any> {
        const url = `${this.url}/doctors`;
        return this.http
            .post(url, doctorProfiles, this.httpOptions)
            .pipe(map((res: any) =>  res as DoctorProfiles ),
            catchError(this.handleError));
    }

    checkUser(email: string): Observable<any> {
        const url = `${this.url}/resetPassword`;
        return this.http
        .post(url, {email: email}, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    resetPassword(password: string, token: string): Observable<any> {
        const url = `${this.url}/resetPassword/${token}`;
        return this.http
        .put(url, {password: password})
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    activateUser(token: string): Observable<any> {
        const url = `${this.url}/activates/${token}`;
        return this.http
        .put(url, {activate: 1})
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    private handleError(error: any): Observable<any> {
        return throwError(error.message || error);
    }
}
