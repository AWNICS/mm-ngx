import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { SecurityService } from './security.service';

@Injectable()
export class SharedService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://35.226.156.161:3000';  // URL to access server
    private location: string;
    private speciality: string;

    constructor(
        private router: Router,
        private http: Http,
        private securityService: SecurityService
    ) {
    }

    setLocation(location: string) {
        this.location = location;
    }

    getLocation() {
        return this.location;
    }

    setSpeciality(speciality: string) {
        this.speciality = speciality;
    }

    getSpeciality() {
        return this.speciality;
    }

    getSpecialities(): Observable<any> {
        const uri = `${this.url}/specialities`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    getLocations(): Observable<any> {
        const uri = `${this.url}/locations`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    getDoctors(location: string, speciality: string, gps: number, time: string, page: number, size: number): Observable<any> {
        const uri1 = `${this.url}/doctors/schedules?`;
        const uri2 = `location=${location}&speciality=${speciality}&gps=${gps}&current_time=${time}&page=${page}&size=${size}`;
        const uri = uri1 + uri2;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    consultNow(doctorId: number, patientId: number) {
        const uri = `${this.url}/groups/doctors/${doctorId}/patients/${patientId}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    private handleError(error: any): Observable<any> {
        return Observable.throw(error.message || error);
    }
}
