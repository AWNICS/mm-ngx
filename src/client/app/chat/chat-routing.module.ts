import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'chat/:userId', component: ChatComponent}
    ])
  ],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
