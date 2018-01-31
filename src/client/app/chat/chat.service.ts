import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { UserDetails } from '../shared/database/user-details';
import { Message } from '../shared/database/message';
import { Group } from '../shared/database/group';

@Injectable()
export class ChatService {
    private headers = new Headers({ 'Content-Type': 'application/json' });
    //private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://localhost:3000/user/controllers';  
    private userUrl = 'http://localhost:3000/user/controllers'; 
    private user: UserDetails;
    private group: Group;
    private groupUrl = 'http://localhost:3000/group/controllers/';  
    private messageUrl = 'http://localhost:3000/message/controllers/';  

    constructor(private router: Router, private http: Http) {
    }

    /** GET users from the server */
    getUsers(): Promise<any> {
        return this.http.get(this.userUrl)
        .toPromise()
        .then(res => res)
        .catch(this.handleError);
    }

    /**
     * GET userById from the server
     */
    getUserById(id: number): Promise<any> {
        return this.http.get(`${this.userUrl}/getUserById/${id}`)
        .toPromise()
        .then(res => res)
        .catch(this.handleError);
    }

    /** GET groups from the server */
    getGroups (userId: number): Promise<any> {
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

    getGroup(){
        return this.group;
    }

    /** GET messages from the server */
    getMessages(userId: number, groupId: number, offset: number, size: number): Promise<any> {
        return this.http.get(
        `${this.messageUrl}getLimitedMessages/user/${userId}/groups/${groupId}/messages?offset=${offset}&size=${size}`
        )
        .toPromise()
        .then(res => res.json())
        .catch(this.handleError);
    }

    private handleError(error: any): Promise<UserDetails> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }

}

