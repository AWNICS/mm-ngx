import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';

/**
 * @export
 * @class AdminRoutingModule
 */
@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'admin', component: AdminComponent }
    ])
  ],
  exports: [RouterModule]
})

export class AdminRoutingModule { }
