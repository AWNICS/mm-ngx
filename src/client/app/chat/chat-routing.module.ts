import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ChatComponent } from './chat.component';
import { RatingModule } from 'ngx-rating';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'chat/:userId', component: ChatComponent}
    ])
  ],
  exports: [RouterModule,RatingModule]
})
export class ChatRoutingModule { }
