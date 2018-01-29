import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Message } from '../shared/database/message';
import { UserDetails } from '../shared/database/user-details';

import 'rxjs/add/operator/toPromise';

/**
 * Service to create,read and update messages
 * @export
 * @class LiveChatService
 */
@Injectable()
export class LiveChatService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/messages';  // URL to web api
  private userUrl = 'api/userDetails';

  constructor(private http: Http) { }

  getUsers(): Promise<UserDetails> {
    return this.http.get(this.userUrl)
      .toPromise()
      .then(response => response.json().data as UserDetails)
      .catch(this.handleError);
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
    const url = `${this.url}/${message._id}`;
    return this.http
      .put(url, JSON.stringify(message), { headers: this.headers })
      .toPromise()
      .then(()=> message)
      .catch(this.handleError);
  }

  delete(message:Message): Promise<void> {
    const url = `${this.url}/${message._id}`;
    return this.http.delete(url,{ headers: this.headers })
      .toPromise()
      .then(() => null)
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
