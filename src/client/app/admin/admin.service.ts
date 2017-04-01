import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { OrderRequest } from '../order-window/order-request';

import 'rxjs/add/operator/toPromise';

/**
 * AdminService module to implement CRUD opertaions
 * @export
 * @class AdminService
 */
@Injectable()
export class AdminService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/orderRequests';  // URL to web api

  constructor(private http: Http) { }

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
  create(orderRequest: OrderRequest) {
    console.log('Create object called. Value is: ' + JSON.stringify(orderRequest));
    return this.http
    .post(this.url, JSON.stringify(orderRequest), { headers: this.headers})
    .toPromise()
    .then(res => res.json().data)
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
      .then(() => null)
      .catch(this.handleError);
  }

  /**
   * deletes an entry using confirmationId
   * @param {number} id
   * @returns {Promise<void>}
   * @memberOf AdminService
   */
  delete(id: number): Promise<void> {
    const url = `${this.url}/${id}`;
    return this.http.delete(url, { headers: this.headers })
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
