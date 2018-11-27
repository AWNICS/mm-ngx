import { Component, ViewChild, OnInit, HostListener, Inject, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { Router } from '@angular/router';

import { Specialities } from '../shared/database/speciality';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ContentsComponent } from './contents.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';
import { Locations } from '../shared/database/location';
import { UserDetails } from '../shared/database/user-details';
import { SocketService } from '../chat/socket.service';
/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements  OnInit, AfterViewInit {

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
    private securityService: SecurityService,
    private socketService: SocketService
  ) {
  }

  ngOnInit(): void {
    window.scrollTo(0,0);
    if(this.securityService.getCookie('userDetails')) {
      this.selectedUser = JSON.parse(this.securityService.getCookie('userDetails'));
    if(window.localStorage.getItem('pageReloaded')==='true') {
      console.log('Page Reloaded');
      this.socketService.connection(this.selectedUser.id);
    }
      if(this.selectedUser.role === 'doctor') {
        this.router.navigate([`/dashboards/doctors/${this.selectedUser.id}`]);
      } else if (this.selectedUser.role === 'admin') {
        this.router.navigate([`/admin/${this.selectedUser.id}`]);
      } else {
        this.router.navigate([`/`]);
      }
    }
    this.getSpecialities();
    this.getGeoLocation();
    this.getLocations();
  }

  ngAfterViewInit() {
    this.notificationRequest();
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
      //this.contentsComponent.scrollDownHidden(number);
      this.navbarComponent.navbarColor(number, '#6960FF');
    } else {
      //this.contentsComponent.scrollDownHidden(number);
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

  notificationRequest() {
    let webNotification = (window as any).Notification;
    if (!webNotification) {
        console.warn('Desktop notifications not available in your browser. Try Chrome.');
        return;
      }
    if(webNotification.permission !== 'granted') {
    webNotification.requestPermission((response:any)=> {
        if(response!=='denied') {
          let notification = new webNotification('Web Notifications Enabled', {
            icon: 'assets/logo/web_notification_logo.png',
            body: 'Hello. You are subscribed to Web Notifications',
          });

          notification.onerror = ()=> {console.log('Error in creating WebNotification');};
        } else {
            console.warn('WebPush notications are Blocked. Try enabling them in browser\'s notification settings');
        }
    });
    }
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
