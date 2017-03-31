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
  styleUrls: ['thanks.component.css']
})
export class ThanksComponent implements OnInit {

  confirmId: any;
  orderRequest: OrderRequest;

  constructor(private orderRequestService: OrderRequestService) { }

  ngOnInit() {
    this.myFunction(); // function call to loading page
    console.log('Thank you component is loaded');
    this.confirmId = this.orderRequestService.randomNumber();
    // this.orderRequest.confirmationId = this.orderRequestService.randomNumber();
    // console.log('This is from Thank you component: ' + this.orderRequest.confirmationId);
    // this.customerDetails = this.orderRequestService.getDetails();
    //console.log(this.customerDetails);
  }


  /**
   * specify the loading page timeout
   * @memberOf ThanksComponent
   */
  myFunction() {
    setTimeout(this.showPage, 2000);
  }

  /**
   * display and hide the elements after the load time.
   * @memberOf ThanksComponent
   */
  showPage() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('myDiv').style.display = 'block';
  }
}
