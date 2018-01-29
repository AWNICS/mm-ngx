import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactUsComponent } from './contact-us.component';
import { ContactUsRoutingModule } from './contact-us-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContactUsService } from './contact-us.service';

@NgModule({
  imports: [ CommonModule, FormsModule, ReactiveFormsModule, ContactUsRoutingModule, SharedModule ],
  declarations: [ContactUsComponent],
  exports: [ContactUsComponent],
  providers: [ContactUsService]
})

export class ContactUsModule { }
