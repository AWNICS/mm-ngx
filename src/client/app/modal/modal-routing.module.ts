import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './modal.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'modal', component: ModalComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ModalRoutingModule { }
