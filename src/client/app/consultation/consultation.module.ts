import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ConsultationRoutingModule } from './consultation-routing.module';
import { ConsultationComponent } from './consultation.component';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, FormsModule, ReactiveFormsModule, ConsultationRoutingModule],
  declarations: [ConsultationComponent],
  exports: [ConsultationComponent]
})
export class ConsultationModule { }
