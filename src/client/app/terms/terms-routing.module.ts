import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TermsComponent } from './terms.component';
import { PoliciesComponent } from './policies.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'terms', component: TermsComponent },
      { path: 'policies', component: PoliciesComponent }
    ])
  ],
  exports: [RouterModule]
})
export class TermsRoutingModule { }
