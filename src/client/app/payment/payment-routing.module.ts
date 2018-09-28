import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaymentSucsessComponent } from './payment-success.component';
import { PaymentFailureComponent } from './payment-failure.component';
import { PaymentCancelComponent } from './payment-cancel.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'payment/:id', component: PaymentComponent },
      { path: 'payment/success', component: PaymentSucsessComponent },
      { path: 'payment/failure', component: PaymentFailureComponent },
      { path: 'payment/cancel', component: PaymentCancelComponent }
    ])
  ],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
