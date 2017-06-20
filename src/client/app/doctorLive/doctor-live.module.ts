import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AppearMessageComponent } from './appear-message.component';

// module for star rating
import { RatingModule } from 'ngx-rating';
//mdoal window
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

@NgModule({
  imports: [CommonModule, SharedModule, DoctorLiveRoutingModule, RatingModule,
  FormsModule, ReactiveFormsModule, Ng2Bs3ModalModule],
  declarations: [DoctorLiveComponent, RadioMessageComponent, SliderMessageComponent, CheckBoxMessageComponent,
  ImageMessageComponent, VideoMessageComponent, TextMessageComponent, AppearMessageComponent],
  exports: [DoctorLiveComponent, RadioMessageComponent, SliderMessageComponent, CheckBoxMessageComponent,
  ImageMessageComponent, VideoMessageComponent, TextMessageComponent, AppearMessageComponent],
  providers: [LiveChatService]
})
export class DoctorLiveModule { }
