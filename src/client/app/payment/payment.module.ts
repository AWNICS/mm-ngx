import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';
import { PaymentSucsessComponent } from './payment-success.component';
import { PaymentFailureComponent } from './payment-failure.component';
import { PaymentCancelComponent } from './payment-cancel.component';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, FormsModule, ReactiveFormsModule, PaymentRoutingModule],
  declarations: [PaymentComponent, PaymentSucsessComponent, PaymentFailureComponent, PaymentCancelComponent],
  exports: [PaymentComponent, PaymentSucsessComponent, PaymentFailureComponent, PaymentCancelComponent]
})
export class PaymentModule { }
