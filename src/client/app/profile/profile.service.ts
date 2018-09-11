import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserDetails } from '../shared/database/user-details';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';
import { StaffInfo } from '../shared/database/staff-info';
import { PatientInfo } from '../shared/database/patient-info';
import { DoctorMedia } from '../shared/database/doctor-media';

@Injectable()
export class ProfileService {
    private url: string;

    constructor(private http: Http, private securityService: SecurityService) {
        this.url = this.securityService.baseUrl;
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
    getDoctorProfilesById(id: number): Observable<any> {
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

    createDoctorMedia(doctorMedia: DoctorMedia): Observable<any> {
        const uri = `${this.url}/doctors/bio`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.post(uri, doctorMedia, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    getDoctorMedia(id:number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/bio`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    getLimitedDoctorMedia(id:number, page:number, size:number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/bio?page=${page}&size=${size}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

    deleteDoctorMedia(id:number): Observable<any> {
        const uri = `${this.url}/doctors/${id}/bio`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.delete(uri, {headers: headers})
        .map(res => res)
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

