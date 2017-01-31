import { NgModule, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';

import { ModalComponent } from './modal.component';
import { ModalRoutingModule } from './modal-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [CommonModule, FormsModule, ModalRoutingModule, SharedModule, Ng2Bs3ModalModule],
  declarations: [ModalComponent],
  exports: [ModalComponent],
  providers: []
})
export class ModalModule { }
