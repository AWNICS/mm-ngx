import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorsListComponent } from './doctors-list.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'doctorsList', pathMatch: 'full', component: DoctorsListComponent}
    ])
  ],
  exports: [RouterModule]
})
export class DoctorsListRoutingModule { }
