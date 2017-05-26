import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { ReplyMessage } from '../shared/database/replyMessage';
import { SentMessage } from '../shared/database/sentMessage';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class LiveChatService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private sentUrl = 'api/sentMessages';  // URL to web api
  private replyUrl = 'api/replyMessages';

  constructor(private http: Http) { }

  getSentMessages(): Promise<SentMessage[]> {
    return this.http.get(this.sentUrl)
      .toPromise()
      .then(response => response.json().data as SentMessage[])
      .catch(this.handleError);
  }

  getReplyMessages(): Promise<ReplyMessage[]> {
    return this.http.get(this.replyUrl)
      .toPromise()
      .then(response => response.json().data as ReplyMessage[])
      .catch(this.handleError);
  }

  createSentMessages(message: string, sentTime:any): Promise<SentMessage> {
    return this.http
    .post(this.sentUrl, JSON.stringify({message: message, sentTime: sentTime}), { headers: this.headers})
    .toPromise()
    .then(res => res.json().data as SentMessage)
    .catch(this.handleError);
  }

  createReplyMessages(message:string, replyTime:any): Promise<ReplyMessage> {
    return this.http
    .post(this.sentUrl, JSON.stringify({message: message, replyTime: replyTime}), {headers: this.headers})
    .toPromise()
    .then(res => res.json().data as ReplyMessage)
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
