import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerticalTimelineModule } from 'angular-vertical-timeline';

import { SharedModule } from '../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DoctorDashboardComponent } from './doctor-dashboard.component';
import { PatientDashboardComponent } from './patient-dashboard.component';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [CommonModule, SharedModule, DashboardRoutingModule, VerticalTimelineModule, PipesModule],
  declarations: [DoctorDashboardComponent, PatientDashboardComponent],
  exports: [DoctorDashboardComponent, PatientDashboardComponent]
})
export class DashboardModule { }
