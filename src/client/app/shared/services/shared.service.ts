import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

// Import RxJs required methods
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { SecurityService } from './security.service';
import { Group } from '../database/group';

@Injectable()
export class SharedService {

    private url: string;  // URL to access server
    private location: string;
    private speciality: string;
    private group: Group;

    constructor(
        private http: Http,
        private securityService: SecurityService
    ) {
        this.url = this.securityService.baseUrl;
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

    setGroup(group: Group) {
        this.group = group;
    }

    getGroup() {
        return this.group;
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

    getAllergies(): Observable<any> {
        const uri = `${this.url}/allergies`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    getLanguages(): Observable<any> {
        const uri = `${this.url}/languages`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    getConsultationModes(): Observable<any> {
        const uri = `${this.url}/consultationmodes`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    getQualifications(): Observable<any> {
        const uri = `${this.url}/qualifications`;
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

    //get all the doctor media information
    getDoctorMedia(userId: number) {
        const uri = `${this.url}/doctors/${userId}/bio`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get all the doctor store information
    getDoctorStore(userId: number) {
        const uri = `${this.url}/doctors/${userId}/bio/extra`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get the doctor_schedule by using doctorId
    getDoctorScheduleByDoctorId(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/schedules`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    updateStatus(status: string, doctorId: number): Observable<any> {
        const uri = `${this.url}/doctors/${doctorId}/schedules/status`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .put(uri, { status: status }, { headers: headers })
            .map(response => {
                response.json();
            })
            .catch(this.handleError);
    }

    getDoctorById(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get all activities for a doctor
    getActivities(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/activities`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get all reviews for a doctor
    getReviews(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/reviews`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get visitor details
    getVisitor(visitorId: number) {
        const uri = `${this.url}/patients/${visitorId}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get visitor store
    getVisitorStore(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/store`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get visitor report
    getVisitorReport(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/reports`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get visitor health
    getVisitorHealth(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/health`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    //get visitor prescription
    getVisitorPrescription(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/prescriptions`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    /* API related to chart */
    getVisitorAppointmentHistory(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/appointments/history`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    /* API related to visitorTimeline */
    getTimeline(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/timeline`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    /**
     * create visitor report
     */
    createVisitorReport(report: any): Observable<any> {
        const uri = `${this.url}/visitors/reports`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.post(uri, report, {headers: headers})
        .map(res => res.json())
        .catch(this.handleError);
    }

     /*
     * returns notifications based on userId
     * @param {number} userId
     * @returns
     * @memberof SharedService
     */
    getNotificationsByUserId(userId: number, page: number, size: number) {
        const uri = `${this.url}/notifications/users/${userId}?page=${page}&size=${size}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    getConsultationsByDoctorId(doctorId: number, page: number, size: number) {
        const uri = `${this.url}/appointments/doctors/${doctorId}?page=${page}&size=${size}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    sendOtp(mobileNo: number) {
        const uri = `${this.url}/send/otp/mobile/${mobileNo}`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    resendOtp(mobileNo: number) {
        const uri = `${this.url}/resend/otp/mobile/${mobileNo}`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    verifyOtp(mobileNo: number, otp: number) {
        const uri = `${this.url}/verify/mobile/${mobileNo}/otp/${otp}`;
        return this.http.get(uri)
            .map(res => res.json());
    }

    /**
     *
     * @param doctorId consultation history
     */
    getConsutationDetails(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/history`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json());
    }

    private handleError(error: any): Observable<any> {
        return Observable.throw(error.message || error);
    }
}
