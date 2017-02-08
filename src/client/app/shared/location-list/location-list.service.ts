import { Injectable } from '@angular/core';
import { Location } from './location';
import { LOCATIONS } from './location-list';

@Injectable()
export class LocationService {
    getLocation(): Promise<Location[]> {
        return Promise.resolve(LOCATIONS);
    }
}