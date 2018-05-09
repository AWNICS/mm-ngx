import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RatingModule } from 'ngx-rating';

import { SharedModule } from '../shared/shared.module';
import { PipesModule } from '../pipes/pipes.module';
import { DoctorsListComponent } from './doctors-list.component';
import { DoctorsListRoutingModule } from './doctors-list-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, RatingModule, FormsModule, ReactiveFormsModule, DoctorsListRoutingModule],
  declarations: [DoctorsListComponent],
  exports: [DoctorsListComponent]
})
export class DoctorsListModule { }
