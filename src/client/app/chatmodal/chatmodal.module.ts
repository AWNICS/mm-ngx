import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatModalComponent } from './chatmodal.component';
//import { VideoModalComponent } from './video-modal.component';


// module for star rating
import { RatingModule } from 'ngx-rating';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  imports: [CommonModule, RatingModule, FormsModule, NgbModule],
  declarations: [ChatModalComponent],
  exports: [ChatModalComponent]
})
export class ChatModalModule { }
