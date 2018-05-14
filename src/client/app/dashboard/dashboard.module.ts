import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard.component';

@NgModule({
  imports: [CommonModule, SharedModule, DashboardRoutingModule],
  declarations: [DoctorDashboardComponent, PatientDashboardComponent],
  exports: [DoctorDashboardComponent, PatientDashboardComponent]
})
export class DashboardModule { }
