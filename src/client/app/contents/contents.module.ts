import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContentsComponent } from './contents.component';
import { ContentsRoutingModule  } from './contents-routing.module';

@NgModule({
  imports: [CommonModule, ContentsRoutingModule],
  declarations: [ContentsComponent],
  exports: [ContentsComponent]
})
export class ContentsModule { }
