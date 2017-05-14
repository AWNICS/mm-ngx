import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { DoctorDetails } from '../shared/database/doctorDetails';

import 'rxjs/add/operator/toPromise';

/**
 * Service to get the doctor details
 * @export
 * @class LiveConsultantService
 */
@Injectable()

export class LiveConsultantService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/doctorDetails';  // URL to web api

  constructor(private http: Http) { }

  /**
   * get the doctor details from db
   * @returns {Promise<DoctorDetails[]>}
   * @memberof LiveConsultantService
   */
  getDoctorDetails(): Promise<DoctorDetails[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json().data as DoctorDetails[])
      .catch(this.handleError);
  }


  /**
   * error handler
   * @private
   * @param {*} error
   * @returns {Promise<any>}
   * @memberof LiveConsultantService
   */
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}
