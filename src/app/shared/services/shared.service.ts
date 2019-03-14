import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

// Import RxJs required methods
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/catch';
import { SecurityService } from './security.service';
import { Group } from '../database/group';

@Injectable()
export class SharedService {

    private url: string;  // URL to access server
    private location: string;
    private speciality: string;
    private group: Group;
    private httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
        })
    };
    private windowNotInFocus: Boolean;
    private windowNotVisible: Boolean;
    private doctorAddedGroupId: Object;
    private initialNavbarLoad: Boolean = true;
    private unreadMessageCount: number;

    constructor(
        private http: HttpClient,
        private securityService: SecurityService
    ) {
        this.url = this.securityService.baseUrl;
    }

    setToken(){
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
            })
        };
        console.log(Headers);
    }

    setLocation(location: string) {
        this.location = location;
    }

    getLocation() {
        return this.location;
    }
    getNavbarLoad() {
        const loadStatus = this.initialNavbarLoad;
        this.initialNavbarLoad = false;
        return loadStatus;
    }
    setNavbarLoad(value: any) {
        this.initialNavbarLoad = value;
    }
    setUnreadCount(count: number) {
        this.unreadMessageCount = count;
    }

    getUnreadCount() {
     return this.unreadMessageCount;
    }

    doctorAddedToGroup(groupInfo: Object) {
        this.doctorAddedGroupId = groupInfo;
    }
    getdoctorAddedGroup() {
        return this.doctorAddedGroupId;
    }
    playsound() {
    try {
        const audio = new Audio('https://instaud.io/_/2VGc.mp3');
        audio.play();
    } catch (e) {
        console.log('Failed to play audio');
        console.log(e);
    }
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
            .pipe(map((res: any) => res));
    }

    getLocations(): Observable<any> {
        const uri = `${this.url}/locations`;
        return this.http.get(uri)
        .pipe(map((res: any) => res));
    }

    getAllergies(): Observable<any> {
        const uri = `${this.url}/allergies`;
        return this.http.get(uri)
        .pipe(map((res: any) => res));
    }

    getLanguages(): Observable<any> {
        const uri = `${this.url}/languages`;
        return this.http.get(uri)
        .pipe(map((res: any) => res));
    }

    getConsultationModes(): Observable<any> {
        const uri = `${this.url}/consultationmodes`;
        return this.http.get(uri)
        .pipe(map((res: any) => res));
    }

    getQualifications(): Observable<any> {
        const uri = `${this.url}/qualifications`;
        return this.http.get(uri)
        .pipe(map((res: any) => res));
    }

    getDoctors(userId: number, location: string, speciality: string, gps: number, time: string, page: number,
         size: number): Observable<any> {
        const uri1 = `${this.url}/doctors/schedules?`;
        const uri2 = `userId=${userId}&location=${location}&speciality=${speciality}&gps=${gps}&current_time=${time}&page=${page}
        &size=${size}`;
        const uri = uri1 + uri2;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res));
    }

    consultNow(doctorId: number, patientId: number) {
        const uri = `${this.url}/groups/doctors/${doctorId}/patients/${patientId}`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res));
    }

    // get all the doctor media information
    getDoctorMedia(userId: number) {
        const uri = `${this.url}/doctors/${userId}/bio`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get all the doctor store information
    getDoctorStore(userId: number) {
        const uri = `${this.url}/doctors/${userId}/bio/extra`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get the doctor_schedule by using doctorId
    getDoctorScheduleByDoctorId(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/schedules`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    updateStatus(status: string, doctorId: number): Observable<any> {
        const uri = `${this.url}/doctors/${doctorId}/schedules/status`;
        return this.http
            .put(uri, { status: status }, this.httpOptions)
            .pipe(map((res: any) => res.json()),
             catchError(this.handleError));
    }

    getDoctorById(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get all activities for a doctor
    getActivities(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/activities`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get all reviews for a doctor
    getReviews(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/reviews`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get visitor details
    getVisitor(visitorId: number) {
        const uri = `${this.url}/patients/${visitorId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get visitor store
    getVisitorStore(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/store`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get visitor report
    getVisitorReport(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/reports`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get visitor health
    getVisitorHealth(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/health`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // get visitor prescription
    getVisitorPrescription(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/prescriptions`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    /* API related to chart */
    getVisitorAppointmentHistory(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/appointments/history`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    /* API related to visitorTimeline */
    getTimeline(visitorId: number) {
        const uri = `${this.url}/visitors/${visitorId}/timeline`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    /**
     * create visitor report
     */
    createVisitorReport(report: any): Observable<any> {
        const uri = `${this.url}/visitors/reports`;
        return this.http.post(uri, report, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    /*
    * returns notifications based on userId
    * @param {number} userId
    * @returns
    * @memberof SharedService
    */
    getNotificationsByUserId(userId: number, page: number, size: number) {
        const uri = `${this.url}/notifications/users/${userId}?page=${page}&size=${size}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    getConsultationsByDoctorId(doctorId: number, page: number, size: number) {
        const uri = `${this.url}/appointments/doctors/${doctorId}?page=${page}&size=${size}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    getConsultationsByVisitorId(visitorId: number, page: number, size: number) {
        const uri = `${this.url}/visitors/${visitorId}/consultations?page=${page}&size=${size}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    getConsultationsByConsultationId(consultationId: number, doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/consultations/${consultationId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    /**
     * all consultations by doctor id
     * @//param visitorId
     * @//param page
     * @//param size
     */
    getAllConsultationsByDoctorId(doctorId: number, page: number, size: number) {
        const uri = `${this.url}/doctors/${doctorId}/consultations?page=${page}&size=${size}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    sendOtp(mobileNo: number) {
        const uri = `${this.url}/send/otp/mobile/${mobileNo}`;
        return this.http.get(uri)
            .pipe(map((res: any) => res));
    }

    resendOtp(mobileNo: number) {
        const uri = `${this.url}/resend/otp/mobile/${mobileNo}`;
        return this.http.get(uri)
            .pipe(map((res: any) => res));
    }

    verifyOtp(mobileNo: number, otp: number) {
        const uri = `${this.url}/verify/mobile/${mobileNo}/otp/${otp}`;
        return this.http.get(uri)
            .pipe(map((res: any) => res));
    }

    /**
     *
     * @param doctorId consultation history
     */
    getConsutationDetails(doctorId: number) {
        const uri = `${this.url}/doctors/${doctorId}/history`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    /**
     *
     * Call to the payment gateway
     * @//param {*} data
     * @/returns {*}
     * @/memberof SharedService
     */
    paymentGatewayCall(data: any): any {
        const uri = `${this.url}/payments/requests`;
        return this.http.post(uri, data, this.httpOptions)
        .pipe(map((res: any) => res));
    }

    /**
     * get all bills
     */
    getBills(visitorId: number, page: number) {
        const uri = `${this.url}/billing/visitors/${visitorId}?page=${page}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }


    /**
     * get bill by billid
     */
    getBillById(visitorId: number, billId: number) {
        const uri = `${this.url}/billing/visitors/${visitorId}/bill/${billId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }
    /**
     * @param doctorId get all bills
     */
    getBillsByDoctorId(doctorId: number, page: number) {
        console.log(page);
        const uri = `${this.url}/billing/doctors/${doctorId}?page=${page}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    /**
     * create audit for audio/video calls at the time of appear message component
     */
    createAudit(audit: any) {
        const uri = `${this.url}/audit`;
        return this.http.post(uri, audit, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    validateFileUpload(file: string, type: string) {
        const response: any =  {'type': null, 'message': null, 'error': null};
        if (type === 'image') {
            const regexMatch = file.match(/[a-z0-9A-Z_]*\.(jpeg|png|jpg)$/);
            if (regexMatch) {
                response.message = 'Success';
                return response;
            } else {
                response.error = 'Failed only jpeg and png are supported';
                return response;
            }
        }
        if (type === 'video') {
            const regexMatch = file.match(/[a-z0-9A-Z_]*\.(mp4|avi)$/);
            if (regexMatch) {
                response.message = 'Success';
                return response;
            } else {
                response.error = 'Failed only mp4 video format is supported';
                return response;
            }
        }
        if (type === 'file') {
            const regexMatch = file.match(/[a-z0-9A-Z_]*\.(pdf)$/);
            if (regexMatch) {
                response.message = 'Success';
                return response;
            } else {
                response.error = 'Failed only PDF files are supported';
                return response;
            }
        }
    }

    /**
     * create prescription info
     */
    updatePrescription(prescription: any) {
        const uri = `${this.url}/visitors/prescriptions`;
        return this.http.put(uri, prescription, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    setWindowVisibility(visibility: Boolean) {
        this.windowNotVisible = visibility;
    }

    // crate web notification
    createWebNotification(title: string, body: string) {
    console.log('Called create web notification');
    const document: any  = window.document;
    if (document.hidden === true || document.msHidden === true || document.webkitHidden === true) {
        this.windowNotInFocus = true;
    } else {
        this.windowNotInFocus = false;
    }
    if (this.windowNotInFocus || this.windowNotVisible) {
        this.playsound();
        const webNotification = (window as any).Notification;
        if (webNotification.permission !== 'denied') {
            console.log('Created web notification');
            const notification = new webNotification(title, {
                icon: 'assets/logo/web_notification_logo.png',
                body: body,
            });
            notification.onclick = () => { window.focus(); };
            // notification.onshow = ()=> {console.log('showed');};
            // notification.onclose = ()=> {console.log('closed');};
            notification.onerror = () => {console.warn('Error in creating WebNotification'); };
          }
    }
}

    /**
     * sendMail to the admin and the visitor
     */
    sendMail(contactInfo: any) {
        const uri = `${this.url}/contacts/email`;
        return this.http.post(uri, contactInfo, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    /**
     * job application email
     */
    careerMail(userDetails: any) {
        const uri = `${this.url}/careers/email`;
        return this.http.post(uri, userDetails, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    /**
     * get report by report id
     */
    getReportById(reportId: number) {
        const uri = `${this.url}/reports/${reportId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res));
    }

    // for reports
    uploadReportsFile(file: File): Observable<any> {
        console.log('triggere');
        const uri = `${this.url}/file/reports`;
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(uri, formData, this.httpOptions)
        .pipe(map((res: any) => res),
        catchError(this.handleError));
    }

    private handleError(error: any): Observable<any> {
        return throwError(error.message || error);
    }
}
