import { Component, OnInit } from '@angular/core';
import { Location } from './location';
import { LocationService } from './location-list.service';
 
@Component({
    moduleId: module.id,
    selector: 'location-list',
    templateUrl: 'location-list.component.html',
    styleUrls: ['location-list.component.css'],
    providers: [LocationService]
})

export class LocationListComponent implements OnInit{
    locations:Location[];
    selectedLocation: Location;

    constructor(private locationService: LocationService) {
    }

    getLocations(): void {
        this.locationService.getLocation().subscribe(locations => this.locations = locations);
    }

    ngOnInit():void {
        this.getLocations();
    }

    onSelect() {
        let select = (<HTMLInputElement>document.getElementById("selectLocation")).value;
        console.log("You have selected " + select);
    }
}