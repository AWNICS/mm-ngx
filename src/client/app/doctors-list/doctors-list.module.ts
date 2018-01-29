import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DoctorsListComponent } from './doctors-list.component';
import { VideoModalComponent } from './video-modal.component';
import { DoctorsListRoutingModule } from './doctors-list-routing.module';
import { DoctorsListService } from './doctors-list.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SharedModule } from '../shared/shared.module';

// module for star rating
import { RatingModule } from 'ngx-rating';

@NgModule({
  imports: [CommonModule, DoctorsListRoutingModule, SharedModule, Ng2Bs3ModalModule, RatingModule],
  declarations: [DoctorsListComponent, VideoModalComponent],
  exports: [DoctorsListComponent],
  providers: [DoctorsListService]
})
export class DoctorsListModule { }
