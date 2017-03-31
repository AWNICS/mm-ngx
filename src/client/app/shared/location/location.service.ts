import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
//import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/do';

import { Location } from './location';

@Injectable()
export class LocationService {

    private _locationUrl = 'api/locations';

    constructor(private _http:Http) {}

    /*getLocation(): Observable<Location[]> {
        return this._http.get(this._locationUrl)
                .map((response: Response) => <Location[]> response.json())
                //.do(data => console.log('All: ' + JSON.stringify(data))) // for debugging only
                .catch(this.handleError);
    }*/

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

/**
 * getOrderRequests(): Promise<OrderRequest[]> {
    return this.http.get(this.url)
      .toPromise()
      .then(response => response.json().data as OrderRequest[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
 */
