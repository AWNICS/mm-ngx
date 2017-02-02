import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsComponent } from './contents.component';
import { ThanksComponent } from './thanks.component';
import { ContentsRoutingModule  } from './contents-routing.module';

@NgModule({
  imports: [CommonModule, ContentsRoutingModule],
  declarations: [ContentsComponent, ThanksComponent],
  exports: [ContentsComponent, ThanksComponent]
})
export class ContentsModule { }
