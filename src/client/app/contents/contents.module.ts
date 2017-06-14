import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsComponent } from './contents.component';
import { ThanksComponent } from './thanks.component';
import { ContentsRoutingModule  } from './contents-routing.module';
import { SharedModule } from '../shared/shared.module';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [CommonModule, ContentsRoutingModule, SharedModule],
  declarations: [ContentsComponent, ThanksComponent, NotFoundComponent],
  exports: [ContentsComponent, ThanksComponent, NotFoundComponent]
})
export class ContentsModule { }
