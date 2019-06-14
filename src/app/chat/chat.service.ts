import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UserDetails } from '../shared/database/user-details';
import { Message } from '../shared/database/message';
import { Group } from '../shared/database/group';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';

@Injectable()
export class ChatService {
    private url: string;
    private hostUrl: string;
    private group: Group;
    private httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
        })
    };
    constructor(
        private http: HttpClient,
        private securityService: SecurityService) {
            this.url = this.securityService.baseUrl;
            this.hostUrl = this.securityService.hostUrl;
    }

    setToken() {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
            })
        };
        console.log(Headers);
    }

    /** GET users from the server */
    getUsers(): Promise<UserDetails[]> {
        const uri = `${this.url}/users`;
        return this.http.get(uri, this.httpOptions)
            .toPromise()
            .then((res: any) => res)
            .catch(this.handleError);
    }
    getVisitorInfo(visitorId) {
        const uri = `${this.url}/visitors/${visitorId}/info`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res) =>  res ),
        catchError(this.handleError));
    }
    /**
     * GET userById from the server
     */
    getUserById(id: number): Observable<any> {
        const uri = `${this.url}/users/${id}`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: UserDetails) =>  res as UserDetails ),
        catchError(this.handleError));
    }

    /** GET groups from the server */
    getGroups(userId: number): Observable<any> {
        const uri = `${this.url}/groups/users/${userId}`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res),
        catchError(this.handleError));
    }

    setGroup(group: any) {
        this.group = group;
    }

    getGroup() {
        return this.group;
    }

    /** GET messages from the server */
    getMessages(userId: number, groupId: number, page: number, size: number): Observable<Message[]> {
        const uri = `${this.url}/messages/users/${userId}/groups/${groupId}?page=${page}&size=${size}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

        getConsultationDetails(patientId: number, doctorId: number, groupId: number): Observable<any> {
        const uri = `${this.url}/visitors/${patientId}/doctors/${doctorId}/appointments?groupId=${groupId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    generatePdf(data: any, doctorId: any, groupId: number): Observable<any> {
        const url = `${this.url}/doctors/${doctorId}/groups/${groupId}/files/pdf`;
        return this.http
            .post(url, data, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    /**
     * create new group using bot or doctor
     */
    createGroupAuto(newGroup: Group, receiverId: number): Observable<Group> {
        const url = `${this.url}/groups/${receiverId}`;
        return this.http
            .post(url, newGroup, this.httpOptions)
            .pipe(map((res: any) => res.json()),
             catchError(this.handleError));
    }

    /**
     * create new group manually using bot or doctor
     */
    createGroupManual(newGroup: Group, receiverId: number, doctorId: number): Observable<Group> {
        const url = `${this.url}/groups/${receiverId}/${doctorId}`;
        return this.http
            .post(url, newGroup, this.httpOptions)
            .pipe(map((res: any) => res.json()),
            catchError(this.handleError));
    }

    /**
     * get doctors
     */
    getDoctors(receiverId: number): Observable<DoctorProfiles[]> {
        const url = `${this.url}/doctors`;
        return this.http
            .get(url, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    getUsersByGroupId(groupId: number): Observable<any> {
        const url = `${this.url}/groups/${groupId}/users`;
        return this.http
            .get(url, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    uploadFile(file: File): Observable<any> {
        const uri = `${this.url}/file`;
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(uri, formData, this.httpOptions)
        .pipe(map((res: any) => res),
        catchError(this.handleError));
    }

    uploadThumbnail(file: File): Observable<any> {
        const uri = `${this.url}/file/thumbnail`;
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post(uri, formData, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    downloadVideoFile(file: string): Observable<any> {
            const uri = `${this.url}/file/${file}`;
            return this.http.get(uri, {
                responseType: 'blob',
                headers: new HttpHeaders({
                    'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
                })
            })
            .pipe(map((res: any) => {
            const blob = new Blob([res], {type: 'video/mp4'});
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return reader; }),
            catchError(this.handleError)
            );
    }
    downloadFile(file: string): any {
        const commonImages = ['group.png', 'user.png', 'doc.png'];
        if (commonImages.indexOf(file) !== -1) {
            const uri = `https://mesomeds.com/assets/img/${file}`;
            return this.http.get(uri, {
                responseType: 'blob'
            })
            .pipe(map((res: any) => {
            const blob = new Blob([res]);
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            return reader; }),
            catchError(this.handleError)
            );
        } else {
        const uri = `${this.url}/file/${file}`;
        return this.http.get(uri, {
            responseType: 'blob',
            headers: new HttpHeaders({
                'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
            })
        })
        .pipe(map((res: any) => {
        const blob = new Blob([res]);
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return reader; }),
        catchError(this.handleError)
        );
        }
    }
    /**
     * for getting all the media files
     */
    media(id: number, page: number, size: number): Observable<any[]> {
        const uri = `${this.url}/messages/media/groups/${id}?page=${page}&size=${size}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    /** GET archived groups from the server */
    getArchivedGroups(userId: number): Observable<any> {
        const uri = `${this.url}/groups/archived/users/${userId}`;
        return this.http.get(uri, this.httpOptions)
            .pipe(map((res: any) => res),
             catchError(this.handleError));
    }

    private handleError(error: any): Promise<UserDetails> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

