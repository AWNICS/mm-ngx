import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { ContactUs } from '../shared/database/contact-us';

/**
 * Service to get the queries details
 */
@Injectable()

export class ContactUsService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/contact';  // URL to web api

  constructor(private http: Http, private router: Router) { }

  /**
   * fetches the contactUs details
   * @returns {Promise<ContactUs[]>}
   * @memberOf ContactUsService
   */
  getMessages(): Promise<ContactUs[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json().data as ContactUs[])
      .catch(this.handleError);
  }

  submitMessage() {
    console.log('message sent..');
  }

  /**
   * get queries list from the api
   */
  create(contactUs: ContactUs): Promise<ContactUs> {
    return this.http
      .post(this.url, JSON.stringify({ contactUs: ContactUs }), { headers: this.headers })
      .toPromise()
      .then(res => res.json().data as ContactUs)
      .catch(this.handleError);
  }

  /**
   * error handler
   */
  private handleError(error: any): Promise<any> {
    //console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
