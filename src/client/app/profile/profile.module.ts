import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { PipesModule } from '../pipes/pipes.module';
import { DoctorProfileComponent } from './doctor-profile.component';
import { PatientProfileComponent } from './patient-profile.component';
import { StaffProfileComponent } from './staff-profile.component';
import { ProfileService } from './profile.service';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, FormsModule, ReactiveFormsModule, ProfileRoutingModule],
  declarations: [ProfileComponent, DoctorProfileComponent, PatientProfileComponent, StaffProfileComponent],
  exports: [ProfileComponent, DoctorProfileComponent, PatientProfileComponent, StaffProfileComponent],
  providers: [ProfileService]
})
export class ProfileModule { }
