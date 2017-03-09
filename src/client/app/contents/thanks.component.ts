import { Component, OnInit } from '@angular/core';
import { OrderRequest } from '../order-window/order-request';
import { OrderRequestService } from '../order-window/order-request.service';
/**
 * This class represents the lazy loaded ThanksComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-thanks',
  templateUrl: 'thanks.component.html',
  styleUrls: ['thanks.component.css'],
})
export class ThanksComponent implements OnInit {

  confirmId:any;
  errorMessage:any;

  constructor(private orderRequestService: OrderRequestService ) {}

  ngOnInit() {
    console.log('Thank you component is loaded');
    this.confirmId = this.orderRequestService.randomNumber();
   // this.customerDetails = this.orderRequestService.getDetails();
    //console.log(this.customerDetails);
  }
 }

/*
ngOnInit(): void {
    this._locationService.getLocation()
      .subscribe(locations => this.locations = locations,
      error => this.errorMessage = <any>error);
  }*/
