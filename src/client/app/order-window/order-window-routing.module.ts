import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OrderWindowComponent } from './order-window.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'modal', component: OrderWindowComponent }
    ])
  ],
  exports: [RouterModule]
})
export class OrderWindowRoutingModule { }
