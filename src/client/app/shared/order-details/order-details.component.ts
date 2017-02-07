import { Component } from '@angular/core';
import { OrderDetails } from './order-details';
 
@Component({
    moduleId: module.id,
    selector: 'order-details',
    templateUrl: 'order-details.component.html',
    styleUrls: ['order-details.component.css']
})

export class OrderDetailsComponent {
  orderDetails = [
      new OrderDetails('Hebbal')
  ];
}