import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { Group } from '../shared/database/group';
import { SecurityService } from '../shared/services/security.service';
import { UserDetails } from '../shared/database/user-details';

@Injectable()
export class AdminService {
    private url: string;

    constructor(
        private http: Http,
        private securityService: SecurityService) {
            this.url = this.securityService.baseUrl;
    }

    /**
     *
     * get all groups to display in the table
     * @returns {Observable<Group[]>}
     * @memberof AdminService
     */
    getAllGroups(): Observable<Group[]> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups`;
        return this.http.get(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    /**
     *
     * get all users to add into the group
     * @returns {Observable<UserDetails[]>}
     * @memberof AdminService
     */
    getAllUsers(): Observable<UserDetails[]> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/users`;
        return this.http.get(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    getAllUsersByGroupId(groupId:number): Observable<UserDetails[]> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups/${groupId}/users`;
        return this.http.get(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    createNewGroup(group:any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups`;
        return this.http.post(uri, group, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    //create new group by admin
    createNewGroupByAdmin(group:any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups/admin`;
        return this.http.post(uri, group, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    updateGroup(group:any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups`;
        return this.http.put(uri, group, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    deleteGroup(group:any): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups/${group.id}`;
        return this.http.delete(uri, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    //mapping users in newly created group
    createGroupUserMap(users: any, groupId: number): Observable<any> {
        let headers = new Headers();
        headers.append('Authorization', `${this.securityService.key} ${this.securityService.getCookie('token')}`);
        const uri = `${this.url}/groups/${groupId}/users/map`;
        return this.http.post(uri, users, { headers: headers })
            .map(res => res.json())
            .catch(this.handleError);
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

