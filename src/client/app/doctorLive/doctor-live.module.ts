import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorLiveComponent } from './doctor-live.component';
import { DoctorLiveRoutingModule } from './doctor-live-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LiveChatService } from './live-chat.service';
import { RadioMessageComponent } from './radio-message.component';
import { SliderMessageComponent } from './slider-message.component';
import { CheckBoxMessageComponent } from './checkbox-message.component';
import { ImageMessageComponent } from './image-message.component';
import { VideoMessageComponent } from './video-message.component';
import { TextMessageComponent } from './text-message.component';

// module for star rating
import { RatingModule } from 'ngx-rating';

@NgModule({
  imports: [CommonModule, SharedModule, DoctorLiveRoutingModule, RatingModule],
  declarations: [DoctorLiveComponent, RadioMessageComponent, SliderMessageComponent, CheckBoxMessageComponent,
  ImageMessageComponent, VideoMessageComponent, TextMessageComponent],
  exports: [DoctorLiveComponent],
  providers: [LiveChatService]
})
export class DoctorLiveModule { }
