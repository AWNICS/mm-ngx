import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorsListComponent } from './doctors-list.component';
import { VideoModalComponent } from './video-modal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'doctorsList', component: DoctorsListComponent }
    ])
  ],
  exports: [RouterModule]
})
export class DoctorsListRoutingModule { }
