import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AgGridModule } from 'ag-grid-angular';

import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { AdminComponent } from './admin.component';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminService } from './admin.service';

@NgModule({
  imports: [
      CommonModule,
      AdminRoutingModule,
      SharedModule,
      FormsModule,
      ReactiveFormsModule,
      NgMultiSelectDropDownModule.forRoot()
    ],
  declarations: [AdminComponent],
  exports: [AdminComponent],
  providers: [AdminService]
})
export class AdminModule { }
