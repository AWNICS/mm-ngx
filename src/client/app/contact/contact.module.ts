import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { ContactComponent } from './contact.component';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';

@NgModule({
  imports: [CommonModule, ContactRoutingModule, SharedModule, Ng2PageScrollModule.forRoot()],
  declarations: [ContactComponent],
  exports: [ContactComponent]
})
export class ContactModule { }
