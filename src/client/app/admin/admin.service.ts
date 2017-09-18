import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { OrderRequest } from '../shared/database/orderRequest';

import 'rxjs/add/operator/toPromise';

/**
 * AdminService to implement CRUD functions
 * @export
 * @class AdminService
 */
@Injectable()
export class AdminService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/orderRequests';  // URL to web api
  private data: any;
  private newData: any;

  constructor(private http: Http) { }

  public setDetails(eventData: any) {
    this.data = eventData;
  }

  public getDetails() {
    return this.data;
  }

  public setNewDetails(eventData: any) {
    this.newData = eventData;
  }

  public getNewDetails() {
    return this.newData;
  }

  /**
   * fetches the orderRequest details of all the customers
   * @returns {Promise<OrderRequest[]>}
   * @memberOf AdminService
   */
  getOrderRequests(): Promise<OrderRequest[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json().data as OrderRequest[])
      .catch(this.handleError);
  }

  /**
   * creates a new entry
   * @param {OrderRequest} orderRequest
   * @returns
   * @memberOf AdminService
   */
  create(orderRequest: OrderRequest): Promise<OrderRequest> {
    return this.http
    .post(this.url, JSON.stringify(orderRequest), { headers: this.headers})
    .toPromise()
    .then(res => res.json().data as OrderRequest)
    .catch(this.handleError);
  }

  /**
   * updates the existing entries
   * @param {OrderRequest} orderRequest
   * @returns {Promise<OrderRequest>}
   * @memberOf AdminService
   */
  update(orderRequest: OrderRequest): Promise<OrderRequest> {
    const url = `${this.url}/${orderRequest.id}`;
    return this.http
      .put(url, JSON.stringify(orderRequest), { headers: this.headers })
      .toPromise()
      .then(() => orderRequest)
      .catch(this.handleError);
  }

  /**
   * deleting an entry using id
   * @param {OrderRequest} orderRequest
   * @returns {Promise<void>}
   * @memberOf AdminService
   */
  delete(orderRequest: OrderRequest): Promise<void> {
    const url = `${this.url}/${orderRequest.id}`;
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
