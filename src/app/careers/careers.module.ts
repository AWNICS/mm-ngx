import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ng2PageScrollModule } from 'ng2-page-scroll';

import { SharedModule } from '../shared/shared.module';
import { CareersRoutingModule } from './careers-routing.module';
import { CareersComponent } from './careers.component';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CareersRoutingModule, SharedModule, Ng2PageScrollModule],
  declarations: [CareersComponent],
  exports: [CareersComponent]
})
export class CareersModule { }
