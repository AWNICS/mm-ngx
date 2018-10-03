import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CareersComponent } from './careers.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'careers', component: CareersComponent }
    ])
  ],
  exports: [RouterModule]
})
export class CareersRoutingModule { }
