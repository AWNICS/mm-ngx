import { Component, ViewChild, Input, Output, OnInit,EventEmitter } from '@angular/core';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { OrderWindowComponent } from '../order-window/order-window.component';
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

  pageTitle: string = "Mesomeds";
  errorMessage: string;

  locations: Location[];

  @Output() mobileNumber: number;
  @Output() location: string;
  
  @ViewChild(OrderWindowComponent)
  modalHtml: OrderWindowComponent;

  constructor(private _locationService: LocationService) { }

  open(mobileNumber: number) {
    let result: boolean = isNaN(mobileNumber);
    if (result == true || mobileNumber.toString().length < 10 || mobileNumber.toString().match(/^\s*$/g)) {
      alert;
    } else {
      this.modalHtml.open();
    }
    this.location = (<HTMLInputElement>document.getElementById("selectLocation")).value;
    console.log(this.location);
  }
  
  ngOnInit(): void {
    this._locationService.getLocation()
    .subscribe(locations => this.locations = locations,
    error => this.errorMessage = <any>error);
  }
}