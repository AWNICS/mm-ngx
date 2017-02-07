import { Component } from '@angular/core';
import { Location } from './location-list';
 
@Component({
    moduleId: module.id,
    selector: 'location-list',
    templateUrl: 'location-list.component.html',
    styleUrls: ['location-list.component.css']
})

export class LocationListComponent {
  locations = [
      new Location('Hebbal'),
      new Location('RT Nagar'),
      new Location('Sanjay Nagar'),
      new Location('Malleswaram'),
      new Location('Sadashivanagar')
  ];
}