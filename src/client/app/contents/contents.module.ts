import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsComponent } from './contents.component';
import { ThanksComponent } from './thanks.component';
import { ContentsRoutingModule  } from './contents-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './not-found.component';

// smooth scroll module
import { Ng2PageScrollModule } from 'ng2-page-scroll';

@NgModule({
  imports: [CommonModule, ContentsRoutingModule, SharedModule, Ng2PageScrollModule.forRoot()],
  declarations: [ContentsComponent, ThanksComponent, NotFoundComponent],
  exports: [ContentsComponent, ThanksComponent, NotFoundComponent]
})
export class ContentsModule { }
