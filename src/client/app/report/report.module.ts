import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, FormsModule, ReactiveFormsModule, ReportRoutingModule],
  declarations: [ReportComponent],
  exports: [ReportComponent]
})
export class ReportModule { }
