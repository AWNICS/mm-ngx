import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderWindowModule } from '../order-window/order-window.module';
import { ContentsModule } from '../contents/contents.module';
import { DoctorsListModule } from '../doctors-list/doctors-list.module';

// smooth scroll module
import { Ng2PageScrollModule } from 'ng2-page-scroll';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, Ng2PageScrollModule.forRoot(),
     SharedModule, OrderWindowModule, ContentsModule, DoctorsListModule],
  declarations: [HomeComponent],
  exports: [HomeComponent]
})
export class HomeModule { }
