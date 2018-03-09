import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatService } from './chat.service';
import { SharedModule } from '../shared/shared.module';
import { SocketService } from './socket.service';
import { DoctorsListModule } from '../doctors-list/doctors-list.module';
import { ChatModalModule } from '../chatmodal/chatmodal.module';

@NgModule({
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule,
    ChatRoutingModule, DoctorsListModule, ChatModalModule],
  declarations: [ChatComponent],
  exports: [ChatComponent],
  providers: [ChatService, SocketService]
})
export class ChatModule { }
