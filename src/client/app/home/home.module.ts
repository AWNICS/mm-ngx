import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ModalModule } from '../modal/modal.module';
import { ContentsModule } from '../contents/contents.module';

@NgModule({
  imports: [CommonModule, FormsModule, HomeRoutingModule, SharedModule, ModalModule, ContentsModule],
  declarations: [HomeComponent],
  exports: [HomeComponent],
  providers: []
})
export class HomeModule { }
