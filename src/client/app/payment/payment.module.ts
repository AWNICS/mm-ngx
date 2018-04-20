import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment.component';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, FormsModule, ReactiveFormsModule, PaymentRoutingModule],
  declarations: [PaymentComponent],
  exports: [PaymentComponent]
})
export class PaymentModule { }
