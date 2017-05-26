import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderWindowModule } from '../order-window/order-window.module';
import { ContentsModule } from '../contents/contents.module';
import { DoctorsListModule } from '../doctorsList/doctors-list.module';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, SharedModule, OrderWindowModule, ContentsModule, DoctorsListModule],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule { }
