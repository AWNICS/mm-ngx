import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit {

  @ViewChild('messageBox') messageBox: ElementRef;
  private userId: number; // to initialize the user logged in
  private selectedUser: UserDetails;
  private selectedGroup: Group;
  private groups: Group[] = [];
  private messages: Message[] = [];
  private message: FormGroup;
  private oldGroupId = 1;
  private offset = 0;
  private groupSelected = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private socketService: SocketService,
    private chatService: ChatService,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId');
    this.chatService.getUserById(this.userId)
      .then(user => this.selectedUser = user)
      .catch(error => console.log('error: ', error));
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
    if (this.oldGroupId === group.id && !this.groupSelected) {
      // if the selected group is same, then append messages
      this.chatService.getMessages(this.selectedUser.id, group.id, this.offset, size)
        .subscribe((msg) => {
          msg.reverse().map((message: any) => {
            this.messages.push(message);
            this.ref.detectChanges();
            this.scrollToBottom();
          });
        });
    } else if (this.oldGroupId !== group.id && !this.groupSelected) {
      // else if user selects different group, clear the messages from array and load new messages
      this.messages = [];
      this.offset = 0;
      this.oldGroupId = group.id;
      this.chatService.getMessages(this.selectedUser.id, group.id, this.offset, size)
        .subscribe((msg) => {
          msg.reverse().map((message: any) => {
            this.messages.push(message);
            this.ref.detectChanges();
            this.scrollToBottom();
          });
        });
    } else {
      // return 0 if user selects same group more than once
      return;
    }
    this.groupSelected = true;
  }

  getMoreMessages(group: Group) {
    const size = 20;
    this.chatService.getMessages(this.selectedUser.id, group.id, this.offset, size)
      .subscribe((msg) => {
        msg.map((message: any) => {
          this.messages.unshift(message);
          this.ref.detectChanges();
        });
      });
  }

  sendMessage({ value, valid }: { value: Message, valid: boolean }): void {
    const result = JSON.stringify(value);
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.receiverType = 'group';
    if (value.text === '') {
      return;
    } else {
      this.socketService.sendMessage(value);
    }
    this.message.reset();
  }

  receiveMessageFromSocket() {
    this.socketService.receiveMessages()
      .subscribe((msg: any) => {
        if (msg.receiverId === this.selectedGroup.id) {
          this.messages.push(msg);
          this.ref.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  getGroups() {
    this.chatService.getGroups(this.userId)
      .then((groups) => {
        groups.map((group: any) => {
          this.groups.push(group);
          this.ref.detectChanges();
        });
      })
      .catch(error => console.log('error: ', error));
  }

  scrollToBottom() {
    const scrollPane: any = this.messageBox.nativeElement;
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

  onScroll() {
    const scrollPane: any = this.messageBox.nativeElement;
    if (scrollPane.scrollTop === 0) {
      this.offset = this.offset + 20;
      this.getMoreMessages(this.selectedGroup);
    }
  }
}
