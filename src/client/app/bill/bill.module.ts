import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BillComponent } from './bill.component';
import { SharedModule } from '../shared/shared.module';
import { BillRoutingModule } from './bill-routing.module';

@NgModule({
  imports: [CommonModule, BillRoutingModule, SharedModule, Ng2PageScrollModule.forRoot(), FormsModule,
    ReactiveFormsModule],
  declarations: [BillComponent],
  exports: [BillComponent]
})
export class BillModule { }
