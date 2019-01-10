import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ContentsComponent } from './contents.component';
import { NotFoundComponent } from './not-found.component';

// smooth scroll module
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { DoctorsListModule } from '../doctors-list/doctors-list.module';

@NgModule({
  imports: [CommonModule, HomeRoutingModule, Ng2PageScrollModule.forRoot(),
     SharedModule, DoctorsListModule],
  declarations: [HomeComponent, ContentsComponent, NotFoundComponent],
  exports: [HomeComponent, ContentsComponent, NotFoundComponent]
})
export class HomeModule { }
