import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ContactComponent } from './contact.component';
import { SharedModule } from '../shared/shared.module';
import { ContactRoutingModule } from './contact-routing.module';

@NgModule({
  imports: [CommonModule, ContactRoutingModule, SharedModule, Ng2PageScrollModule.forRoot(), FormsModule,
    ReactiveFormsModule],
  declarations: [ContactComponent],
  exports: [ContactComponent]
})
export class ContactModule { }
