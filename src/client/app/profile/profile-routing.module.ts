import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { DoctorViewProfileComponent } from './doctor-view-profile.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'profiles/:id', component: ProfileComponent },
      { path: 'profiles/doctors/:id', component: DoctorViewProfileComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
