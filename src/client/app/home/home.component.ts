import { Component, ViewChild, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { OrderWindowComponent } from '../order-window/order-window.component';
import { DoctorsListComponent } from '../doctorsList/doctors-list.component';
import { OrderRequest } from '../order-window/order-request';
import { SpecialityService } from '../shared/speciality/speciality.service';
import { Specialities } from '../shared/speciality/speciality';
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
  speciality: string;
  mobileNumber: number;
  specialities: Specialities[];

  @ViewChild(OrderWindowComponent)
  modalHtml: OrderWindowComponent;

  @ViewChild(DoctorsListComponent)
  modalHtml1: DoctorsListComponent;

  current:string = 'Select'; //first string to load in the select field

  constructor(private specialityService: SpecialityService) { //constructor for LocationService
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
    console.log(value.speciality);
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
    this.getSpecialities();
  }

  getSpecialities() {
    this.specialityService.getSpecialities()
    .then(Specialities => {
      this.specialities = Specialities;
    });
  }
}
