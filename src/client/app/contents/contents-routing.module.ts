import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContentsComponent } from './contents.component';
import { ThanksComponent } from './thanks.component';
import { NotFoundComponent } from './not-found.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'contents', component: ContentsComponent },
      { path: 'thanks', component: ThanksComponent },
      { path: 'error', component: NotFoundComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
