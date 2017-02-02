import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentsComponent } from './contents.component';
import { ThanksComponent } from './thanks.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contents', component: ContentsComponent },
      { path: 'thanks', component: ThanksComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
