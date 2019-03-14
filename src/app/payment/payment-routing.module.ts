import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentComponent } from './payment.component';
import { PaymentSucsessComponent } from './payment-success.component';
import { PaymentFailureComponent } from './payment-failure.component';
import { PaymentCancelComponent } from './payment-cancel.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'payments/:id', component: PaymentComponent, pathMatch: 'full' },
      { path: 'payments/status/success', component: PaymentSucsessComponent, pathMatch: 'full' },
      { path: 'payments/status/failure', component: PaymentFailureComponent, pathMatch: 'full' },
      { path: 'payments/status/cancel', component: PaymentCancelComponent, pathMatch: 'full' }
    ])
  ],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
