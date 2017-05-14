import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Location } from './location';

@Injectable()
export class LocationService {

    private _locationUrl = 'api/locations';

    constructor(private _http:Http) {}

    getLocations(): Promise<Location[]> {
        return this._http.get(this._locationUrl)
        .toPromise()
        .then(response => response.json().data as Location[])
        .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Promise.reject(error.json().error || 'Server error');
    }
}
