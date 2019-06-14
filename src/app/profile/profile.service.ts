import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { UserDetails } from '../shared/database/user-details';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';
import { StaffInfo } from '../shared/database/staff-info';
import { PatientInfo } from '../shared/database/patient-info';
import { DoctorMedia } from '../shared/database/doctor-media';

@Injectable()
export class ProfileService {
    private url: string;
    private httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
        })
    };

    constructor(private http: HttpClient, private securityService: SecurityService) {
        this.url = this.securityService.baseUrl;
    }
    setToken() {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
            })
        };
        console.log(Headers);
    }
    /**
     * GET userById from the server
     */
    getUserDetailsById(id: number): Observable<UserDetails> {
        const uri = `${this.url}/users/${id}`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res as UserDetails),
        catchError(this.handleError));
    }

    updateUserDetails(userDetails: UserDetails): Observable<any> {
        const uri = `${this.url}/users`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, userDetails, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    /**
     * get doctors
     */
    getDoctorProfilesById(id: number): Observable<any> {
        const url = `${this.url}/doctors/${id}`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .get(url, this.httpOptions)
            .pipe(map((res: any) => res),
            catchError(this.handleError));
    }

    updateDoctorProfiles(doctorProfiles: DoctorProfiles): Observable<any> {
        const uri = `${this.url}/doctors`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, doctorProfiles, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    getPatientInfoById(id: number): Observable<PatientInfo> {
        const url = `${this.url}/patients/${id}`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(url, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    updatePatientInfo(patientInfo: PatientInfo): Observable<any> {
        const uri = `${this.url}/patients`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, patientInfo, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    getStaffById(id: number): Observable<StaffInfo> {
        const url = `${this.url}/staffs/${id}`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
        .get(url, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    updateStaffInfo(staffInfo: StaffInfo): Observable<any> {
        const uri = `${this.url}/staffs`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.put(uri, staffInfo, this.httpOptions)
            .pipe(map((res: any) => res.json()),
             catchError(this.handleError));
    }

    createDoctorMedia(doctorMedia: DoctorMedia): Observable<any> {
        const uri = `${this.url}/doctors/bio`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.post(uri, doctorMedia, this.httpOptions)
            .pipe(map((res: any) => res.json()),
             catchError(this.handleError));
    }

    getDoctorMedia(id: number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/bio`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    getDoctorDigitalSignature(id: number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/digitalsig`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    getLimitedDoctorMedia(id: number, page: number, size: number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/bio?page=${page}&size=${size}`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    deleteDoctorMedia(id: number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/bio`;
        const headers = new HttpHeaders();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.delete(uri, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

