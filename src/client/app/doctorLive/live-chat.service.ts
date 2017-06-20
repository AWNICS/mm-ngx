import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Message } from '../shared/database/message';

import 'rxjs/add/operator/toPromise';

/**
 * Service to create,read and update messages
 * @export
 * @class LiveChatService
 */
@Injectable()
export class LiveChatService {

  public message: Message;
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/messages';  // URL to web api

  constructor(private http: Http) { }

  setMessage(message: Message) {
    this.message = message;
  }

  getMessage() {
    return this.message;
  }

  getMessages(): Promise<Message[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json().data as Message[])
      .catch(this.handleError);
  }

  createMessages(newMessage: Message): Promise<Message> {
    return this.http
    .post(this.url, JSON.stringify(newMessage), { headers: this.headers})
    .toPromise()
    .then(res => res.json().data as Message)
    .catch(this.handleError);
  }

  update(message:Message): Promise<Message> {
    const url = `${this.url}/${message.id}`;
    return this.http
      .put(url, JSON.stringify(message), { headers: this.headers })
      .toPromise()
      .then(()=> message)
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
