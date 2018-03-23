import {
  Component,
  AfterViewChecked,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';

import { SocketService } from './socket.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from './chat.service';
import { Group } from '../shared/database/group';
import { Message } from '../shared/database/message';
import { DoctorDetails } from '../shared/database/doctor-details';

/**
 * This class represents the lazy loaded ChatComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'mm-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.css', 'w3schools.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewChecked {

 apperUrl='https://appear.in/arun-gadag';
  @Output() safeUrl: any;
  @ViewChild('messageBox') messageBox: ElementRef;
  @ViewChild('mySidebar') mySidebar: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;
  @ViewChild('ChatComponent') chatComponent: ChatComponent;
  userId: number; // to initialize the user logged in
  selectedUser: UserDetails;
  selectedGroup: Group;
  groups: Group[] = [];
  messages: Message[] = [];
  message: FormGroup;
  oldGroupId = 1;
  offset = 0;
  groupSelected = false;
  doctors: DoctorDetails[] = [];
  doctorList = true; //for listing down the doctors in modal window
  time:any;

  newGroup: Group = {
    id: null,
    name: '',
    url: '',
    userId: null,
    description: '',
    picture: '',
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  newMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: '',
    picUrl: '',
    type: 'text',
    status: '',
    contentType: 'text',
    contentData: {
      data: ['']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  radioMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Kindly choose an option: ',
    picUrl: '',
    type: 'radio',
    status: 'delivered',
    contentType: 'radio',
    contentData: {
      data: ['option1', 'option2', 'option3']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  sliderMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Kindly choose a number from 0 to 10: ',
    picUrl: '',
    type: 'slider',
    status: 'delivered',
    contentType: 'slider',
    contentData: {
      data: ['']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  checkboxMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Kindly check the relevent boxes: ',
    picUrl: '',
    type: 'checkbox',
    status: 'delivered',
    contentType: 'checkbox',
    contentData: {
      data: ['option1', 'option2', 'option3']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  imageMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Image Component',
    picUrl: '',
    type: 'image',
    status: 'delivered',
    contentType: 'image',
    contentData: {
      data: ['']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  videoMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Video Component',
    picUrl: '',
    type: 'video',
    status: 'delivered',
    contentType: 'video',
    contentData: {
      data: ['']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  docMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Doc Component',
    picUrl: '',
    type: 'doc',
    status: 'delivered',
    contentType: 'doc',
    contentData: {
      data: ['']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  appearMessage: Message = {
    _id: null,
    receiverId: null,
    receiverType: null,
    senderId: null,
    text: 'Appear Component',
    picUrl: '',
    type: 'appear',
    status: 'delivered',
    contentType: 'appear',
    contentData: {
      data: ['']
    },
    responseData: {
      data: ['']
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date.now(),
    updatedTime: Date.now()
  };

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location,
    private socketService: SocketService,
    private chatService: ChatService,
    private ref: ChangeDetectorRef,
    private domSanitizer: DomSanitizer
  ) {
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId');
    this.chatService.getUserById(this.userId)
      .then(user => {
        this.selectedUser = user;
      })
      .catch(error => console.log('error: ', error));
    this.chatService.setUser(this.selectedUser);
    this.socketService.connection(this.userId);
    this.getGroups();
    this.createForm();
    this.receiveMessageFromSocket();
    this.receiveUpdatedMessageFromSocket();
    //this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl('this.selectedUser.appearUrl');
  }

  ngAfterViewChecked() {
    setTimeout(() => {
      let dropdown = this.dropdown.nativeElement;
      if (this.selectedUser.role !== 'patient') {
        dropdown.style.display = 'block';
      }
    }, 1000);
  }

  createForm() {
    this.message = this.fb.group({
      _id: null, // message id
      receiverId: [''],
      receiverType: [''], // group or individual
      senderId: [''],
      picUrl: [''], // image of the sender or receiver
      text: [''], // message data
      type: [''], // type of the message(checkbox, radio, image, video, etc)
      status: [''], // delivered, read, not-delivered
      contentType: [''], // for radio, checkbox and slider
      contentData: {
        data: [''] // for radio, checkbox and slider
      },
      responseData: {
        data: [''] // for radio, checkbox and slider
      },
      createdBy: [''],
      updatedBy: [''],
      createdTime: null,
      updatedTime: null
    });
  }

  createRadio() {
    this.radioMessage.receiverId = this.chatService.getGroup().id;
    this.radioMessage.senderId = this.selectedUser.id;
    this.radioMessage.receiverType = 'group';
    this.radioMessage.contentType = 'radio';
    this.radioMessage.type = 'radio';
    this.radioMessage.contentData.data = ['Yes', 'No', 'May be'];
    this.radioMessage.status = 'delivered';
    this.radioMessage.text = 'Would you like to visit the doctor in person? ';
    this.socketService.sendMessage(this.radioMessage);
  }

  createSlider() {
    this.sliderMessage.receiverId = this.chatService.getGroup().id;
    this.sliderMessage.senderId = this.selectedUser.id;
    this.sliderMessage.receiverType = 'group';
    this.sliderMessage.contentType = 'slider';
    this.sliderMessage.type = 'slider';
    this.sliderMessage.status = 'delivered';
    this.sliderMessage.text = 'Kindly choose a number from 0 to 10: ';
    this.socketService.sendMessage(this.sliderMessage);
  }

  createCheckbox() {
    this.checkboxMessage.receiverId = this.chatService.getGroup().id;
    this.checkboxMessage.senderId = this.selectedUser.id;
    this.checkboxMessage.receiverType = 'group';
    this.checkboxMessage.contentType = 'checkbox';
    this.checkboxMessage.type = 'checkbox';
    this.checkboxMessage.contentData.data = ['Headache', 'Giddiness', 'Feverish'];
    this.checkboxMessage.status = 'delivered';
    this.checkboxMessage.text = 'Kindly select your observed symptoms: ';
    this.socketService.sendMessage(this.checkboxMessage);
  }

  createAppear() {
    this.appearMessage.receiverId = this.chatService.getGroup().id;
    this.appearMessage.senderId = this.selectedUser.id;
    this.appearMessage.receiverType = 'group';
    this.appearMessage.contentType = 'appear';
    this.appearMessage.type = 'appear';
    this.appearMessage.status = 'delivered';
    this.appearMessage.text = 'Appear Component';
    this.socketService.sendMessage(this.appearMessage);
    this.safeUrl = 'https://appear.in/arun-gadag';
  }

  createImage(files: FileList) {
    this.chatService.uploadFile(files)
      .subscribe(res => {
        console.log('response is ', res);
        this.imageMessage.contentData.data = res._body;
        this.imageMessage.receiverId = this.chatService.getGroup().id;
        this.imageMessage.senderId = this.selectedUser.id;
        this.imageMessage.receiverType = 'group';
        this.imageMessage.contentType = 'image';
        this.imageMessage.type = 'image';
        this.imageMessage.status = 'delivered';
        this.imageMessage.text = 'Image Component';
        this.socketService.sendMessage(this.imageMessage);
      });
  }

  createVideo(videos: FileList) {
    this.chatService.uploadFile(videos)
      .subscribe(res => {
        this.videoMessage.contentData.data = res._body;
        this.videoMessage.receiverId = this.chatService.getGroup().id;
        this.videoMessage.senderId = this.selectedUser.id;
        this.videoMessage.receiverType = 'group';
        this.videoMessage.contentType = 'video';
        this.videoMessage.type = 'video';
        this.videoMessage.status = 'delivered';
        this.videoMessage.text = 'Video Component';
        this.socketService.sendMessage(this.videoMessage);
      });
  }

  createFile(files: FileList) {
    this.chatService.uploadFile(files)
      .subscribe(res => {
        this.docMessage.contentData.data = res._body;
        this.docMessage.receiverId = this.chatService.getGroup().id;
        this.docMessage.senderId = this.selectedUser.id;
        this.docMessage.receiverType = 'group';
        this.docMessage.contentType = 'doc';
        this.docMessage.type = 'doc';
        this.docMessage.status = 'delivered';
        this.docMessage.text = 'Doc Component';
        this.socketService.sendMessage(this.docMessage);
        console.log('Response ', res);
      });
  }

  createGroupAuto() {
    this.newGroup.name = 'Consultation room';
    this.newGroup.picture = 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.description = 'Chat room for consultation';
    this.newGroup.createdBy = this.selectedUser.name;
    this.newGroup.updatedBy = this.selectedUser.name;
    this.chatService.createGroupAuto(this.newGroup, this.selectedGroup.id)
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  createGroupManual(doctor: DoctorDetails) {
    this.newGroup.name = 'Consultation room manually';
    this.newGroup.picture = 'https://d30y9cdsu7xlg0.cloudfront.net/png/363633-200.png';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.description = 'Chat room for consultation';
    this.newGroup.createdBy = this.selectedUser.name;
    this.newGroup.updatedBy = this.selectedUser.name;
    this.chatService.createGroupManual(this.newGroup, this.selectedGroup.id, doctor.id)
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  addNewEntry(event: any) {
    if (!event.value) { return; }
    this.newMessage.text = event.value;
    this.newMessage.receiverId = this.chatService.getGroup().id;
    this.newMessage.senderId = this.selectedUser.id;
    this.newMessage.receiverType = 'group';
    this.newMessage.contentType = 'text';
    this.newMessage.type = 'text';
    this.newMessage.createdTime = Date.now();
    this.newMessage.updatedTime = Date.now();
    this.newMessage.status = 'delivered';
    if (this.newMessage.text === '') {
      return;
    } else {
      this.socketService.sendMessage(this.newMessage);
    }
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
            this.time = moment(message.createdTime).format('LT');
            this.messages.push(message);
            this.ref.detectChanges();
            this.scrollToBottom();
          });
        });
    } else if (this.oldGroupId !== group.id) {
      // else if user selects different group, clear the messages from array and load new messages
      this.messages = [];
      this.offset = 0;
      this.oldGroupId = group.id;
      this.chatService.getMessages(this.selectedUser.id, group.id, this.offset, size)
        .subscribe((msg) => {
          msg.reverse().map((message: any) => {
            this.time = moment(message.createdTime).format('LT');
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
          this.time = moment(message.createdTime).format('LT');
          this.messages.unshift(message);
          this.ref.detectChanges();
        });
      });
  }

  sendMessage({ value }: { value: Message }): void {
    const result = JSON.stringify(value);
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.receiverType = 'group';
    value.contentType = 'text';
    value.type = 'text';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.status = 'delivered';
    if (value.text.match(/^\s*$/g) || value.text === "" || value.text === null) {
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
          this.time = moment(msg.createdTime).format('LT');
          this.messages.push(msg);
          this.ref.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  receiveUpdatedMessageFromSocket() {
    this.socketService.receiveUpdatedMessage()
      .subscribe((msg: any) => {
        if (msg.receiverId === this.selectedGroup.id) {
          this.ref.detectChanges();
        }
      });
  }

  getGroups() {
    this.chatService.getGroups(this.userId)
      .then((groups) => {
        //debugger;
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

  //getDoctors
  getDoctors() {
    if (this.doctorList) {
      this.chatService.getDoctors(this.userId)
        .subscribe((doctors) => {
          doctors.map((doctor: any) => {
            this.doctors.push(doctor);
            this.ref.detectChanges();
          });
        });
    }
    this.doctorList = false;
  }

  open() {
    this.mySidebar.nativeElement.style.display = 'block';
  }

  close() {
    this.mySidebar.nativeElement.style.display = 'none';
  }
}
