import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillComponent } from './bill.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'bills/:billId', component: BillComponent }
    ])
  ],
  exports: [RouterModule]
})
export class BillRoutingModule { }
