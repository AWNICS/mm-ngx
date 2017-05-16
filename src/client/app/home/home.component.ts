import { Component, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { OrderWindowComponent } from '../order-window/order-window.component';
import { LiveConsultantComponent } from '../liveConsultant/live-consultant.component';
import { OrderRequest } from '../order-window/order-request';
import { LocationService } from '../shared/location/location.service';
import { Location } from '../shared/location/location';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {

  pageTitle: string = 'Mesomeds';
  //errorMessage: boolean = false;
  location: string;
  mobileNumber: number;
  locations: Location[];

  @ViewChild(OrderWindowComponent)
  modalHtml: OrderWindowComponent;

  @ViewChild(LiveConsultantComponent)
  modalHtml1: LiveConsultantComponent;

  current:string = 'RT Nagar'; //first string to load in the select field

  constructor(private locationService: LocationService) { //constructor for LocationService
  }

  //function to validate the phone number entered and open the OrderWindow else show an alert
  open(value: any) {
    let result: boolean = isNaN(value.mobileNumber);
    if (result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)) {
      return;
      //this.errorMessage = true;
    } else {
      this.modalHtml.open();
    }
    console.log(value.location);
  }

  openConsultant(value: any) {
    let result: boolean = isNaN(value.mobileNumber);
    if (result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)) {
      return;
    } else {
      this.modalHtml1.open();
    }
  }

  //initializes the select field options from LocationService
  ngOnInit(): void {
    this.getLocations();
  }

  getLocations() {
    this.locationService.getLocations()
    .then(locations => {
      this.locations = locations;
    });
  }
}
