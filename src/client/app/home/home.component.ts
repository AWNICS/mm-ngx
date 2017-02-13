import { Component, ViewChild, Output, OnInit } from '@angular/core';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { OrderWindowComponent } from '../order-window/order-window.component';
import { LocationService } from '../shared/location/location.service';
import { Location } from '../shared/location/location';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit { 

  constructor(private locationService: LocationService) {}

  locations:Location[];
  loc: string;

  //items:Array<string>;
  name:string = 'Mesomeds';
  @Output() tel:number;

  getName() {
    return name;
  }
  
  @ViewChild(OrderWindowComponent)
    modalHtml: OrderWindowComponent;

    open(tel:number) {
        let result:boolean = isNaN(tel);
        if( result == true || tel.toString().length < 10 || tel.toString().match(/^\s*$/g)) {
          alert;
        } else {
          console.log("Number you have entered is " + tel);
          this.modalHtml.open();
        }
    }

    setLocation(value:string) {
      var setLocation = value;
      console.log("This is new value:" + " " + setLocation);
    }
    
    getLocations(): void {
        this.locationService.getLocation().subscribe(locations => this.locations = locations);
    }

    ngOnInit():void {
        this.getLocations();
    }
}