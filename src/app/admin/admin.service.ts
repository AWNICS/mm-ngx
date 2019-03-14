import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Group } from '../shared/database/group';
import { SecurityService } from '../shared/services/security.service';
import { UserDetails } from '../shared/database/user-details';

@Injectable()
export class AdminService {
    private url: string;
    private httpOptions = {
        headers: new HttpHeaders({
            'Authorization': `${this.securityService.key} ${this.securityService.getCookie('token')}`
        })
    };
    constructor(
        private http: HttpClient,
        private securityService: SecurityService) {
            this.url = this.securityService.baseUrl;
    }

    /**
     *
     * get all groups to display in the table
     * @//returns {Observable<Group[]>}
     * @//memberof AdminService
     */
    getAllGroups(): Observable<Group[]> {
        const uri = `${this.url}/groups`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res),
        catchError(this.handleError));
    }

    /**
     *
     * get all users to add into the group
    //  * @//returns {Observable<UserDetails[]>}
      * @//memberof AdminService
     */
    getAllUsers(): Observable<UserDetails[]> {
        const uri = `${this.url}/users`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res),
        catchError(this.handleError));
    }

    getAllUsersByGroupId(groupId: number): Observable<UserDetails[]> {
        const uri = `${this.url}/groups/${groupId}/users`;
        return this.http.get(uri, this.httpOptions)
        .pipe(map((res: any) => res),
        catchError(this.handleError));
    }

    createNewGroup(group: any): Observable<any> {
        const uri = `${this.url}/groups`;
        return this.http.post(uri, group, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    // create new group by admin
    createNewGroupByAdmin(group: any): Observable<any> {
        const uri = `${this.url}/groups/admin`;
        return this.http.post(uri, group, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    updateGroup(group: any): Observable<any> {
        const uri = `${this.url}/groups`;
        return this.http.put(uri, group, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    deleteGroup(group: any): Observable<any> {
        const uri = `${this.url}/groups/${group.id}`;
        return this.http.delete(uri, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    // mapping users in newly created group
    createGroupUserMap(users: any, groupId: number): Observable<any> {
        const uri = `${this.url}/groups/${groupId}/users/map`;
        return this.http.post(uri, users, this.httpOptions)
        .pipe(map((res: any) => res.json()),
        catchError(this.handleError));
    }

    private handleError(error: any): Promise<any> {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}

