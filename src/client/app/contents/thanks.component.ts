import { Component, OnInit, AfterContentChecked } from '@angular/core';
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
export class ThanksComponent implements OnInit, AfterContentChecked {

  confirmId: any;
  orderRequest: OrderRequest;

  constructor(private orderRequestService: OrderRequestService) {
   }

  ngOnInit() {
    console.log('Thank you component is loaded');
    this.confirmId = this.orderRequestService.randomNumber();
  }

  ngAfterContentChecked() {
    this.myFunction();
  }

   myFunction() {
      setTimeout(this.showPage, 3000);
  }

  showPage() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('myDiv').style.display = 'block';
  }

}
