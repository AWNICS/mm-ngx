import { Component, OnInit, AfterViewChecked, group } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { SocketService } from './socket.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from './chat.service';
import { Group } from '../shared/database/group';
import { Message } from '../shared/database/message';

/**
 * This class represents the lazy loaded ChatComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-chat',
    templateUrl: 'chat.component.html',
    styleUrls: ['chat.component.css'],
})
export class ChatComponent {
    private userId: number; // to initialize the user logged in
    private selectedUser: UserDetails;
    private selectedGroup: Group;
    private groups: Group[] = [];
    private messages: Message[] = [];
    private message: FormGroup;
    private oldGroupId = 1;
    private offset = 0;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private location: Location,
        private socketService: SocketService,
        private chatService: ChatService,
      ) {
      }

    ngOnInit(): void {
        this.userId = 1;
        this.chatService.getUserById(this.userId)
        .then(user => this.selectedUser = user)
        .catch(error => console.log('error: ', error));
          //.subscribe(user => this.selectedUser = user);
        this.chatService.setUser(this.selectedUser);
        this.socketService.connection(this.userId);
        this.getGroups();
        this.createForm();
        this.receiveMessageFromSocket();
    }

    createForm() {
        this.message = this.fb.group({
          _id: null, // message id
          receiverId: [''],
          receiverType: [''], // group or individual
          senderId: [''],
          picUrl: [''], // image of the sender or receiver
          text: [''], // message data
          type: ['text'], // type of the message(checkbox, radio, image, video, etc)
          status: ['delivered'], // delivered, read, not-delivered
          contentType: [''], // for radio, checkbox and slider
          contentData: {
            data: [''] // for radio, checkbox and slider
          },
          responseData: {
            data: [''] // for radio, checkbox and slider
          },
          createdBy: [''],
          updatedBy: [''],
          createdTime: Date.now(),
          updatedTime: Date.now()
        });
    }

    getMessage(group: Group) {
        this.chatService.setGroup(group);
        this.selectedGroup = group;
        const size = 20;
        if (this.oldGroupId === group.id) {
          this.chatService.getMessages(this.selectedUser.id, group.id, this.offset, size)
            .then((msg) => {
                msg.reverse().map((message: any) => {
                    this.messages.push(message);
                });
            })
            .catch(error => console.log('error: ', error));
            /*.subscribe((msg) => {
              msg.reverse().map((message) => {
                this.messages.push(message);
              });
            });*/
        } else {
          this.messages = [];
          this.offset = 0;
          this.oldGroupId = group.id;
          this.chatService.getMessages(this.selectedUser.id, group.id, this.offset, size)
            .then((msg) => {
                msg.reverse().map((message: any) => {
                    this.messages.push(message);
                });
            })
            .catch(error => console.log('error: ', error));
            /*.subscribe((msg) => {
              msg.reverse().map((message) => {
                this.messages.push(message);
              });
            });*/
        }
      }

    receiveMessageFromSocket() {
        this.socketService.receiveMessages()
          .subscribe((msg: any) => {
            if (msg.receiverId === this.selectedGroup.id) {
              this.messages.push(msg);
            }
          });
      }
    
    
      getGroups() {
        this.chatService.getGroups(this.userId)
        .then((groups) => {
            groups.map((group: any) => {
                this.groups.push(group);
            });
        })
        .catch(error => console.log('error: ', error));
          //.subscribe(groups => this.groups = groups);
      }
}
