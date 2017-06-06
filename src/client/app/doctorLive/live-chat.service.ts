import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Message } from '../shared/database/message';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LiveChatService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/messages';  // URL to web api

  constructor(private http: Http) { }

  getMessages(): Promise<Message[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json().data as Message[])
      .catch(this.handleError);
  }

  createMessages(text: string, sentTime:any, type: string, contentType:string): Promise<Message> {
    console.log('create messages: ' + text + ' ' + sentTime + ' ' + type + ' ' );
    return this.http
    .post(this.url, JSON.stringify({text: text, sentTime: sentTime, type: type, contentType: contentType}), { headers: this.headers})
    .toPromise()
    .then(res => res.json().data as Message)
    .catch(this.handleError);
  }

  /**
   * error handling
   * @private
   * @param {*} error
   * @returns {Promise<any>}
   * @memberOf AdminService
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
