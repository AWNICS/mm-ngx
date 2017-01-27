import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentsComponent } from './contents.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contents', component: ContentsComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
