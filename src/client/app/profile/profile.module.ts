import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RatingModule } from 'ngx-rating';
import { DragScrollModule } from 'ngx-drag-scroll';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { SharedModule } from '../shared/shared.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';
import { PipesModule } from '../pipes/pipes.module';
import { DoctorProfileComponent } from './doctor-profile.component';
import { PatientProfileComponent } from './patient-profile.component';
import { StaffProfileComponent } from './staff-profile.component';
import { ProfileService } from './profile.service';
import { DoctorViewProfileComponent } from './doctor-view-profile.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PipesModule,
    FormsModule,
    ReactiveFormsModule,
    ProfileRoutingModule,
    RatingModule,
    DragScrollModule,
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [
    ProfileComponent,
    DoctorProfileComponent,
    PatientProfileComponent,
    StaffProfileComponent,
    DoctorViewProfileComponent
  ],
  exports: [
    ProfileComponent,
    DoctorProfileComponent,
    PatientProfileComponent,
    StaffProfileComponent,
    DoctorViewProfileComponent
  ],
  providers: [ProfileService]
})
export class ProfileModule { }
