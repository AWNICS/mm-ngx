import { Component, ViewChild, OnInit, HostListener, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Specialities } from '../shared/database/speciality';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ContentsComponent } from './contents.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { Locations } from '../shared/database/location';
import { UserDetails } from '../shared/database/user-details';
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
  user: any;
  location: string;
  locations: Locations[];
  currentLocation: string = 'Bangalore';
  currentSpeciality: string = 'Physician';
  selectedUser: UserDetails;

  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild(ContentsComponent) contentsComponent: ContentsComponent;

  constructor(
    @Inject(DOCUMENT) private document: Document, // used to get the position of the scroll
    private sharedService: SharedService,
    private router: Router,
    private securityService: SecurityService
  ) {
  }

  ngOnInit(): void {
    if(this.securityService.getCookie('userDetails')) {
      this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
    }
    this.getSpecialities();
    this.getGeoLocation();
    this.getLocations();
  }

  showDoctorsList(value: any) {
    this.user = this.securityService.getCookie('userDetails');
    if (//result === true || value.mobileNumber.toString().length < 10 || value.mobileNumber.toString().match(/^\s*$/g)
      value.location === null ||
      value.location === '' ||
      value.speciality === null ||
      value.speciality === ''
    ) {
      return;
    } else {
      if ((this.user)) {
        this.sharedService.setLocation(value.location);
        this.sharedService.setSpeciality(value.speciality);
        this.router.navigate([`/doctors`]);
      } else {
        this.sharedService.setLocation(value.location);
        this.sharedService.setSpeciality(value.speciality);
        this.router.navigate([`/login`]);
      }
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    let number = window.scrollY;
    if (number > 500) {
      this.navIsFixed = true;
      document.getElementById('myBtn').style.display = 'block';
    } else if (this.navIsFixed && number < 1000) {
      this.navIsFixed = false;
      document.getElementById('myBtn').style.display = 'none';
    }

    //for moving to next section and to show navbar
    if (number > 100) {
      this.contentsComponent.scrollDownHidden(number);
      this.navbarComponent.navbarColor(number, '#6960FF');
    } else {
      this.contentsComponent.scrollDownHidden(number);
      this.navbarComponent.navbarColor(number, 'transparent');
    }
  }

  getSpecialities() {
    this.sharedService.getSpecialities()
      .subscribe(specialities => {
        this.specialities = specialities;
      });
  }

  getLocations() {
    this.sharedService.getLocations()
      .subscribe(locations => {
        this.locations = locations;
      });
  }

  getGeoLocation() {
    const options = {
      enableHighAccuracy: true
    };
    window.navigator.geolocation.getCurrentPosition((pos) => {
      var crd = pos.coords;

      console.log('Your current position is:');
      console.log(`Latitude : ${crd.latitude}`);
      console.log(`Longitude: ${crd.longitude}`);
      console.log(`More or less ${crd.accuracy} meters.`);
    }, (err) => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }, options);
  }
}
