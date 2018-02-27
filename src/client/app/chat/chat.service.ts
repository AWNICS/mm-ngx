import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserDetails } from '../shared/database/user-details';
import { Message } from '../shared/database/message';
import { Group } from '../shared/database/group';
import { DoctorDetails } from '../shared/database/doctor-details';

@Injectable()
export class ChatService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://localhost:3000/user/controllers';
    private userUrl = 'http://localhost:3000/user/controllers';
    private groupUrl = 'http://localhost:3000/group/controllers/';
    private messageUrl = 'http://localhost:3000/message/controllers/';
    private doctorUrl = 'http://localhost:3000/doctor/controllers/';
    private fileUrl = 'http://localhost:3000/file/controllers';
    private user: UserDetails;
    private group: Group;

    constructor(private router: Router, private http: Http) {
    }

    /** GET users from the server */
    getUsers(): Promise<UserDetails[]> {
        return this.http.get(this.userUrl)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    /**
     * GET userById from the server
     */
    getUserById(id: number): Promise<UserDetails> {
        return this.http.get(`${this.userUrl}/getUserById/${id}`)
            .toPromise()
            .then(res => res.json() as UserDetails)
            .catch(this.handleError);
    }

    /** GET groups from the server */
    getGroups(userId: number): Promise<Group[]> {
        return this.http.get(`${this.groupUrl}getGroups/user/${userId}/groups`)
            .toPromise()
            .then(res => res.json())
            .catch(this.handleError);
    }

    setUser(user: any) {
        this.user = user;
    }

    getUser() {
        return this.user;
    }

    setGroup(group: any) {
        this.group = group;
    }

    getGroup() {
        return this.group;
    }

    /** GET messages from the server */
    getMessages(userId: number, groupId: number, offset: number, size: number): Observable<Message[]> {
        const uri = `${this.messageUrl}getLimitedMessages/user/${userId}/groups/${groupId}/messages?offset=${offset}&size=${size}`;
        return this.http.get(uri)
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     * create new group using bot or doctor
     */
    createGroupAuto(newGroup: Group, receiverId: number): Observable<Group> {
        const url = `${this.groupUrl}createGroupAuto/${receiverId}`;
        return this.http
            .post(url, newGroup, this.options)
            .map(response => response.json())
            .catch(this.handleError);
    }

    /**
     * create new group manually using bot or doctor
     */
    createGroupManual(newGroup: Group, receiverId: number, doctorId: number): Observable<Group> {
        const url = `${this.groupUrl}createGroupManual/${receiverId}/${doctorId}`;
        return this.http
            .post(url, newGroup, this.options)
            .map(response => response.json())
            .catch(this.handleError);
    }

    /**
     * get doctors
     */
    getDoctors(receiverId: number): Observable<DoctorDetails[]> {
        const url = `${this.doctorUrl}getDoctors`;
        return this.http
            .get(url, this.options)
            .map(res => res.json())
            .catch(this.handleError);
    }

    uploadImage(images: FileList): Observable<any> {
        const uri = `${this.fileUrl}/image/up`;
        let formData = new FormData();
        Array.from(images).forEach(f => {
            formData.append('file', f);
        });
        return this.http.post(uri, formData)
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    downloadImage(image: string): Observable<any> {
        const uri = `${this.fileUrl}/image/down/${image}`;
        return this.http.get(uri, {
            responseType: ResponseContentType.Blob
        })
            .map((res: Response) => {
                const blob = new Blob([res.blob()], { type: 'image/jpeg' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                return reader;
            })
            .catch(this.handleError);
    }

    uploadVideo(videos: FileList): Observable<any> {
        const uri = `${this.fileUrl}/video/up`;
        let formData = new FormData();
        Array.from(videos).forEach(f => {
            formData.append('file', f);
        });
        return this.http.post(uri, formData)
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    downloadVideo(video: string): Observable<any> {
        const uri = `${this.fileUrl}/video/down/${video}`;
        return this.http.get(uri, {
            responseType: ResponseContentType.Blob
        })
            .map((res: Response) => {
                const blob = new Blob([res.blob()], { type: 'video/*' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                return reader;
            })
            .catch(this.handleError);
    }

    uploadDoc(docs: FileList): Observable<any> {
        const uri = `${this.fileUrl}/doc/up`;
        let formData = new FormData();
        Array.from(docs).forEach(f => {
            formData.append('file', f);
        });
        return this.http.post(uri, formData)
            .map((res: Response) => res)
            .catch(this.handleError);
    }

    downloadDoc(doc: string): Observable<any> {
        const uri = `${this.fileUrl}/doc/down/${doc}`;
        return this.http.get(uri, {
            responseType: ResponseContentType.Blob
        })
            .map((res: Response) => {
                const blob = new Blob([res.blob()], { type: '*/*' });
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                return reader;
            })
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<UserDetails> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

