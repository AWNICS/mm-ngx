import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { OrderRequest } from '../order-window/order-request';
import { OrderRequestService } from '../order-window/order-request.service';
import { AdminService } from '../admin/admin.service';
/**
 * This class represents the lazy loaded ThanksComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-thanks',
  templateUrl: 'thanks.component.html',
  styleUrls: ['thanks.component.css']
})
export class ThanksComponent implements OnInit, AfterContentChecked {

  orderRequests: OrderRequest[];

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    console.log('Thank you component is loaded');
    this.getOrderRequests();
  }

  getOrderRequests():void {
    this.adminService.getOrderRequests()
    .then(orderRequests => this.orderRequests = orderRequests);
  }

  ngAfterContentChecked() {
    this.myFunction();
  }

   /**
    * 
    * @memberOf ThanksComponent
    */
   myFunction() {
      setTimeout(this.showPage(),2000);
  }

  showPage () {
    console.log(document.getElementsByTagName('h1').item(0).innerText);
    document.getElementById('loader').style.display = 'none';
    document.getElementById('myDiv').style.display = 'block';
  }

}
