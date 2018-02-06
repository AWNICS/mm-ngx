import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import { Specialities } from '../database/speciality';

const httpOptions = {
    headers: new Headers({ 'Content-Type': 'application/json' })
  };

@Injectable()
export class SpecialityService {

    private specialityUrl = 'http://localhost:3000/specialities/controllers/readAllSpecialities';

    constructor(private http: Http) {}

    getSpecialities(): Promise<Specialities[]> {
        return this.http.get(this.specialityUrl)
          .toPromise()
          .then(response => response.json() as Specialities[])
          .catch(this.handleError);
      }

    private handleError(error: Response) {
        console.error(error);
        return Promise.reject(error.json() || 'Server error');
    }
}
