import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { OrderWindowModule } from '../order-window/order-window.module';
import { ContentsComponent } from './contents.component';
import { ThanksComponent } from './thanks.component';
import { NotFoundComponent } from './not-found.component';

// smooth scroll module
import { Ng2PageScrollModule } from 'ng2-page-scroll';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, Ng2PageScrollModule.forRoot(),
     SharedModule, OrderWindowModule],
  declarations: [HomeComponent, ContentsComponent, ThanksComponent, NotFoundComponent],
  exports: [HomeComponent, ContentsComponent, ThanksComponent, NotFoundComponent]
})
export class HomeModule { }
