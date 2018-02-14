import { Component, ViewChild, Input, Output, OnInit, EventEmitter, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { OrderWindowComponent } from '../order-window/order-window.component';
import { DoctorsListComponent } from '../doctors-list/doctors-list.component';
import { OrderRequest } from '../shared/database/order-request';
import { SpecialityService } from '../shared/speciality/speciality.service';
import { Specialities } from '../shared/database/speciality';
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
  navIsFixed: boolean = false;

  @ViewChild(OrderWindowComponent)
  modalHtml: OrderWindowComponent;

  @ViewChild(DoctorsListComponent)
  modalHtml1: DoctorsListComponent;

  current: string = 'Select'; //first string to load in the select field

  constructor( @Inject(DOCUMENT) private document: Document, // used to get the position of the scroll
    private specialityService: SpecialityService) { //constructor for LocationService
  }

  //function to validate the phone number entered and open the OrderWindow else show an alert
  open(value: any) {
    let result: boolean = isNaN(value.mobileNumber);
    if (result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)
  || value.speciality === null || value.speciality === 'Select') {
      return;
    } else {
      this.modalHtml.open();
    }
  }

  openConsultant(value: any) {
    let result: boolean = isNaN(value.mobileNumber);
    let speciality: string = value.speciality;
    if (result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)
      || speciality === null || speciality === 'Select') {
      return;
    } else {
      this.modalHtml1.open('lg');
    }
  }

  //initializes the select field options from LocationService
  ngOnInit(): void {
    this.getSpecialities();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number = this.document.body.scrollTop;
    // console.log(number);
    // console.log(document.body.offsetHeight);
    if (number > 800) {
      this.navIsFixed = true;
      document.getElementById('myBtn').style.display = 'block';
    } else if (this.navIsFixed && number < 1000) {
      this.navIsFixed = false;
      document.getElementById('myBtn').style.display = 'none';
    }
  }

  /*topFunction() {
    this.document.body.scrollTop = 0;
    this.document.documentElement.scrollTop = 0;
  }*/

  getSpecialities() {
    this.specialityService.getSpecialities()
      .then( specialities => this.specialities = specialities);
  }
}
