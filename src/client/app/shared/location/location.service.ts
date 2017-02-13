import { Injectable } from '@angular/core';
import { Location } from './location';
import { Http } from '@angular/http';

@Injectable()
export class LocationService {

    constructor(private http:Http) {
        console.log("Loading the application from LocationService");
    }

    getLocation(){
        return this.http.get('src/client/app/shared/data/location.json')
                .map(res => res.json());
    }
}