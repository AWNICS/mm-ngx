import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLiveComponent } from './user-live.component';
import { UserLiveRoutingModule } from './user-live-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DoctorLiveModule } from '../doctorLive/doctor-live.module';

// module for star rating
import { RatingModule } from 'ngx-rating';
//mdoal window
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
  imports: [CommonModule, SharedModule, UserLiveRoutingModule, RatingModule,
  FormsModule, ReactiveFormsModule, Ng2Bs3ModalModule, DoctorLiveModule],
  declarations: [UserLiveComponent],
  exports: [UserLiveComponent]
})
export class UserLiveModule { }
