import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorLiveComponent } from './doctor-live.component';
import { DoctorLiveRoutingModule } from './doctor-live-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LiveChatService } from './live-chat.service';

// module for star rating
import { RatingModule } from 'ngx-rating';

@NgModule({
  imports: [CommonModule, SharedModule, DoctorLiveRoutingModule, RatingModule],
  declarations: [DoctorLiveComponent],
  exports: [DoctorLiveComponent],
  providers: [LiveChatService]
})
export class DoctorLiveModule { }
