import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { UserDetails } from '../shared/database/user-details';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ChatService {

    private headers = new Headers({ 'Content-Type': 'application/json' });
    private options = new RequestOptions({ headers: this.headers }); // Create a request option
    private url = 'http://localhost:3000/userClone/controllers';  // URL to access server

    constructor(private router: Router, private http: Http) {
    }

}
