import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { SharedModule } from '../shared/shared.module';
import { SocketService } from './socket.service';
import { RatingModule } from 'ngx-rating';
import { PipesModule } from '../pipes/pipes.module';

@NgModule({
  imports: [CommonModule, SharedModule, PipesModule, FormsModule, ReactiveFormsModule, ChatRoutingModule, RatingModule ],
  declarations: [ChatComponent],
  exports: [ChatComponent],
  providers: [ChatService, SocketService]
})
export class ChatModule { }
