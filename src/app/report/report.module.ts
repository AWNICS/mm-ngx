import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { ReportRoutingModule } from './report-routing.module';
import { ReportComponent } from './report.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

// import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// FlatpickrModule.forRoot(),
@NgModule({
  imports: [CommonModule, BrowserAnimationsModule, SharedModule,
     PipesModule, FormsModule, ReactiveFormsModule, ReportRoutingModule, NgbModalModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    })],
  declarations: [ReportComponent],
  exports: [ReportComponent]
})
export class ReportModule { }
