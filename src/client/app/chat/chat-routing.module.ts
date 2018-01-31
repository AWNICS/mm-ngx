import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'chat', component: ChatComponent }
    ])
  ],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
