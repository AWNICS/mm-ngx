import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Headers, Http, Response } from '@angular/http';
import { DoctorDetails } from '../shared/database/doctorDetails';

import 'rxjs/add/operator/toPromise';

/**
 * Service to get the doctor details
 * @export
 * @class LiveConsultantService
 */
@Injectable()

export class DoctorsListService {

  private headers = new Headers({ 'Content-Type': 'application/json' });
  private url = 'api/doctorDetails';  // URL to web api
  private selectedDoctor: DoctorDetails;
  private videoUrl: string;

  constructor(private http: Http, private router: Router) { }

  setSelectedDoctor(doctor: DoctorDetails) {
    this.selectedDoctor = doctor;
    this.router.navigate(['/doctorLive']);
  }

  getSelectedDoctor() {
    return this.selectedDoctor;
  }

  setVideoUrl(videoUrl: string) {
    this.videoUrl = videoUrl;
  }

  getVideoUrl() {
    return this.videoUrl;
  }

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
