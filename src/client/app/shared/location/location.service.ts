import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';

import { Location } from './location';

@Injectable()
export class LocationService {

    private _locationUrl = "src/client/app/shared/data/location.json";

    constructor(private _http:Http) {}

    getLocation(): Observable<Location[]>{
        return this._http.get(this._locationUrl)
                .map((response: Response) => <Location[]> response.json())
                .do(data => console.log("All: " + JSON.stringify(data)))
                .catch(this.handleError);
    }

    private handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || "Server error");
    }
}