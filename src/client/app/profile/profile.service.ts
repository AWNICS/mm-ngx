import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response, RequestOptions,ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserDetails } from '../shared/database/user-details';
import { Message } from '../shared/database/message';
import { Group } from '../shared/database/group';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';
import { StaffInfo } from '../shared/database/staff-info';
import { PatientInfo } from '../shared/database/patient-info';

@Injectable()
export class ProfileService {
    private headers = new Headers();
    private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://35.226.156.161:3000';
    private user: UserDetails;
    private group: Group;
    private StaffInfo: StaffInfo;
    private patientInfo: PatientInfo;
    private doctorProfiles: DoctorProfiles;

    constructor(private router: Router, private http: Http, private securityService: SecurityService) {
    }

    /**
     * GET userById from the server
     */
    getUserDetailsById(id: number): Observable<UserDetails> {
        const uri = `${this.url}/users/${id}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, {headers: headers})
            .map(res => res.json() as UserDetails)
            .catch(this.handleError);
    }

    updateUserDetails(userDetails: UserDetails): Observable<any> {
        const uri = `${this.url}/users`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, userDetails, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    /**
     * get doctors
     */
    getDoctorProfilesById(id: number): Observable<DoctorProfiles> {
        const url = `${this.url}/doctors/${id}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .get(url, {headers: headers})
            .map(res => res.json())
            .catch(this.handleError);
    }

    updateDoctorProfiles(doctorProfiles: DoctorProfiles): Observable<any> {
        const uri = `${this.url}/doctors`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, doctorProfiles, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    getPatientInfoById(id: number): Observable<PatientInfo> {
        const url = `${this.url}/patients/${id}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
        .get(url, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    updatePatientInfo(patientInfo: PatientInfo): Observable<any> {
        const uri = `${this.url}/patients`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, patientInfo, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    getStaffById(id: number): Observable<StaffInfo> {
        const url = `${this.url}/staffs/${id}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
        .get(url, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    updateStaffInfo(staffInfo: StaffInfo): Observable<any> {
        const uri = `${this.url}/staffs`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, staffInfo, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

