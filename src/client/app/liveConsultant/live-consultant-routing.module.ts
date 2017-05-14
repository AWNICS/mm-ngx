import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LiveConsultantComponent } from './live-consultant.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'consultantModal', component: LiveConsultantComponent }
    ])
  ],
  exports: [RouterModule]
})
export class LiveConsultantRoutingModule { }
