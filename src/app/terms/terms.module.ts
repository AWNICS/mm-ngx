import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermsComponent } from './terms.component';
import { TermsRoutingModule } from './terms-routing.module';
import { SharedModule } from '../shared/shared.module';
import { PoliciesComponent } from './policies.component';

@NgModule({
  imports: [CommonModule, TermsRoutingModule, SharedModule],
  declarations: [TermsComponent, PoliciesComponent],
  exports: [TermsComponent, PoliciesComponent]
})
export class TermsModule { }
