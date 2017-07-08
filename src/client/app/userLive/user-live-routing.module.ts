import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserLiveComponent } from './user-live.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'userLive', component: UserLiveComponent}
    ])
  ],
  exports: [RouterModule]
})
export class UserLiveRoutingModule { }
