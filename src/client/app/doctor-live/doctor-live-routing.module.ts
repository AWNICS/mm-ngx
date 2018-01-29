import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorLiveComponent } from './doctor-live.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'doctorLive', component: DoctorLiveComponent}
    ])
  ],
  exports: [RouterModule]
})
export class DoctorLiveRoutingModule { }
