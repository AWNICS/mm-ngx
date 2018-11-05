import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'admin/:userId', component: AdminComponent }
    ])
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
