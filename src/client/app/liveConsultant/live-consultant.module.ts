import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveConsultantComponent } from './live-consultant.component';
import { LiveConsultantRoutingModule } from './live-consultant-routing.module';
import { LiveConsultantService } from './live-consultant.service';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, LiveConsultantRoutingModule, SharedModule, Ng2Bs3ModalModule],
  declarations: [LiveConsultantComponent],
  exports: [LiveConsultantComponent],
  providers: [LiveConsultantService]
})
export class LiveConsultantModule { }
