import { Injectable } from '@angular/core';
import { Headers, Http, Response, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserDetails } from '../shared/database/user-details';
import { Message } from '../shared/database/message';
import { Group } from '../shared/database/group';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { SecurityService } from '../shared/services/security.service';

@Injectable()
export class ChatService {
    private url: string;
    private group: Group;

    constructor(
        private http: Http,
        private securityService: SecurityService) {
            this.url = this.securityService.baseUrl;
    }

    /** GET users from the server */
    getUsers(): Promise<UserDetails[]> {
        const uri = `${this.url}/users`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * GET userById from the server
     */
    getUserById(id: number): Observable<UserDetails> {
        const uri = `${this.url}/users/${id}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json() as UserDetails)
            .catch(this.handleError);
    }

    /** GET groups from the server */
    getGroups(userId: number): Observable<Group[]> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups/users/${userId}`;
        return this.http.get(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
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
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * create new group using bot or doctor
     */
    createGroupAuto(newGroup: Group, receiverId: number): Observable<Group> {
        const url = `${this.url}/groups/${receiverId}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .post(url, newGroup, { headers: headers })
            .map(response => response.json())
            .catch(this.handleError);
    }

    /**
     * create new group manually using bot or doctor
     */
    createGroupManual(newGroup: Group, receiverId: number, doctorId: number): Observable<Group> {
        const url = `${this.url}/groups/${receiverId}/${doctorId}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .post(url, newGroup, { headers: headers })
            .map(response => response.json())
            .catch(this.handleError);
    }

    /**
     * get doctors
     */
    getDoctors(receiverId: number): Observable<DoctorProfiles[]> {
        const url = `${this.url}/doctors`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http
            .get(url, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    uploadFile(file: File): Observable<any> {
        const uri = `${this.url}/file`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        let formData = new FormData();
        formData.append('file', file);
        return this.http.post(uri, formData, { headers: headers })
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    uploadThumbnail(file: File): Observable<any> {
        const uri = `${this.url}/file/thumbnail`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        let formData = new FormData();
        formData.append('file', file);
        return this.http.post(uri, formData, { headers: headers })
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    downloadFile(file: string): Observable<any> {
        const uri = `${this.url}/file/${file}`;
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        return this.http.get(uri, {
            responseType: ResponseContentType.Blob,
            headers: headers
        })
            .map((res: Response) => {
                const blob = new Blob([res.blob()]);
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                return reader;
            })
            .catch(this.handleError);
    }

    /**
     * for getting all the media files
     */
    media(id: number, page: number, size: number): Observable<any[]> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/messages/media/groups/${id}?page=${page}&size=${size}`;
        return this.http.get(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<UserDetails> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

