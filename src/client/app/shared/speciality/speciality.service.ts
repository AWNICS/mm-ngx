import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Specialities } from './speciality';

@Injectable()
export class SpecialityService {

    private specialityUrl = 'api/specialities';

    constructor(private _http:Http) {}

    getSpecialities(): Promise<Specialities[]> {
        return this._http.get(this.specialityUrl)
        .toPromise()
        .then(response => response.json().data as Specialities[])
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Promise.reject(error.json().error || 'Server error');
    }
}
