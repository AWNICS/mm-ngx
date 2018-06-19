import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'dashboards/doctors/:id', component: DoctorDashboardComponent },
      { path: 'dashboards/patients/:id', component: PatientDashboardComponent }
    ])
  ],
  exports: [RouterModule]
})

export class DashboardRoutingModule { }
