import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SocketService } from './socket.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from './chat.service';
import { Group } from '../shared/database/group';
import { Message } from '../shared/database/message';
import { DoctorProfiles } from '../shared/database/doctor-profiles';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { SharedService } from '../shared/services/shared.service';

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
export class ChatComponent implements OnInit {

  @Output() safeUrl: any;
  @ViewChild('messageBox') messageBox: ElementRef;
  @ViewChild('mySidebar') mySidebar: ElementRef;
  @ViewChild('chat') chat: ElementRef;
  @ViewChild('rightSidebar') rightSidebar: ElementRef;
  @ViewChild('dropDown') dropDown: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;

  userId: number; // to initialize the user logged in
  selectedUser: UserDetails;
  selectedGroup: Group;
  groups: Group[] = [];
  messages: Message[] = [];
  message: FormGroup;
  oldGroupId = 1;
  page = 1;
  groupSelected = false;
  doctors: DoctorProfiles[] = [];
  doctorList = true; //for listing down the doctors in modal window
  searchText: string;
  searchFile: string;
  altGroupPic: string;
  altDocPic: string;
  alert: boolean = false;
  alertMessage: string; //alert for deleted message and doctor exit
  fileUrl: SafeResourceUrl;
  mediaMessages: Message[] = [];
  mediaPage = 1;
  form = {
    receiverId: '',
    receiverType: '', // group or individual
    senderId: '',
    picUrl: '', // image of the sender or receiver
    text: '', // message data
    type: '', // type of the message(checkbox, radio, image, video, etc)
    status: '', // delivered, read, not-delivered
    contentType: '', // for radio, checkbox and slider
    contentData: {
      data: [''] // for radio, checkbox and slider
    },
    responseData: {
      data: [''] // for radio, checkbox and slider
    },
    createdBy: '',
    updatedBy: '',
    createdTime: Date,
    updatedTime: Date
  };

  newGroup: Group = {
    id: null,
    name: '',
    url: '',
    userId: null,
    description: '',
    picture: '',
    status: '',
    createdBy: null,
    updatedBy: null,
    createdTime: Date.now(),
    updatedTime: Date.now()
  };
  unreadMessages: any = {};
  typingEvent: Boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private socketService: SocketService,
    private chatService: ChatService,
    private ref: ChangeDetectorRef,
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private securityService: SecurityService,
    private router: Router,
    private sharedService: SharedService
  ) {
  }

  ngOnInit(): void {
    this.navbarComponent.navbarColor(0, '#6960FF');
    this.userId = +this.route.snapshot.paramMap.get('userId');
    this.selectedGroup = this.sharedService.getGroup();
    const cookie = this.securityService.getCookie('userDetails');
    if (cookie === '' || this.userId !== JSON.parse(cookie).id) {
      this.router.navigate([`/login`]);
    } else if (this.userId === JSON.parse(cookie).id) {
      this.chatService.getUserById(this.userId)
        .subscribe(user => {
          this.selectedUser = user;
          this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
            `https://appear.in/${this.selectedUser.firstname}-${this.selectedUser.lastname}`
          );
        });
      this.getGroups();
      this.createForm();
      this.receiveMessageFromSocket();
      this.receiveNotification();
      this.receiveUpdatedMessageFromSocket();
      this.receiveDeletedMessageFromSocket();
      this.consultationStatus();
      this.typingEventEmitter();
      this.typingEventListener();
    } else {
      this.router.navigate([`/`]);
    }
  }

  typingEventEmitter() {
    this.textArea.nativeElement.addEventListener('input', (event: any) => {
      if (this.typingEvent) {
        this.typingEvent = false;
        let fullName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
        this.socketService.typingEmitter(this.selectedGroup.id, fullName);
        setTimeout(() => {
          this.typingEvent = true;
        }, 8000);
      }
    });
  }

  typingEventListener() {
    this.socketService.typingListener().subscribe((response) => {
      if (this.selectedGroup.id === response.groupId) {
        this.alert = true;
        this.alertMessage = response.userName + ' is typing ...';
        this.ref.markForCheck();
        setTimeout(() => {
          this.alertMessage = null;
          this.ref.markForCheck();
        }, 8000);
      }
    });
  }

  createForm() {
    this.message = this.fb.group(this.form);
  }

  createRadio({ value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
    value.receiverType = 'group';
    value.contentType = 'radio';
    value.type = 'radio';
    value.contentData.data = ['Yes', 'No', 'May be'];
    value.status = 'delivered';
    value.text = 'Would you like to visit the doctor in person? ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value, this.selectedGroup);
    this.message.reset(this.form);
  }

  createSlider(type: string, { value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
    value.receiverType = 'group';
    value.contentType = 'slider';
    value.type = type;
    value.status = 'delivered';
    value.text = 'Kindly choose a number from 0 to 10: ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value, this.selectedGroup);
    this.message.reset(this.form);
  }

  createCheckbox({ value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
    value.receiverType = 'group';
    value.contentType = 'checkbox';
    value.type = 'checkbox';
    value.contentData.data = ['Headache', 'Giddiness', 'Feverish'];
    value.status = 'delivered';
    value.text = 'Kindly select your observed symptoms: ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value, this.selectedGroup);
    this.message.reset(this.form);
  }

  createAppear({ value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
    value.receiverType = 'group';
    value.contentType = 'appear';
    value.type = 'appear';
    value.status = 'delivered';
    value.text = 'Appear Component';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value, this.selectedGroup);
    this.message.reset(this.form);
  }

  createImage(event: any, { value }: { value: Message }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let images: FileList = event.target.files;
    this.chatService.uploadFile(images[0])
      .subscribe(res => {
        value.contentData.data = res._body;
        value.receiverId = this.chatService.getGroup().id;
        value.senderId = this.selectedUser.id;
        value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
        value.receiverType = 'group';
        value.contentType = 'image';
        value.type = 'image';
        value.status = 'delivered';
        value.text = 'Image Component';
        value.createdTime = Date.now();
        value.updatedTime = Date.now();
        this.socketService.sendMessage(value, this.selectedGroup);
      });
    this.message.reset(this.form);
    event.target.value = '';
  }

  createVideo(event: any, { value, valid }: { value: Message, valid: boolean }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let videos: FileList = event.target.files;
    this.chatService.uploadFile(videos[0])
      .subscribe(res => {
        value.contentData.data = res._body;
        value.receiverId = this.chatService.getGroup().id;
        value.senderId = this.selectedUser.id;
        value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
        value.receiverType = 'group';
        value.contentType = 'video';
        value.type = 'video';
        value.status = 'delivered';
        value.text = 'Video Component';
        value.createdTime = Date.now();
        value.updatedTime = Date.now();
        this.socketService.sendMessage(value, this.selectedGroup);
      });
    this.message.reset(this.form);
    event.target.value = '';
  }

  createFile(event: any, { value, valid }: { value: Message, valid: boolean }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let files: FileList = event.target.files;
    this.chatService.uploadFile(files[0])
      .subscribe(res => {
        value.contentData.data = res._body;
        value.receiverId = this.chatService.getGroup().id;
        value.senderId = this.selectedUser.id;
        value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
        value.receiverType = 'group';
        value.contentType = 'doc';
        value.type = 'doc';
        value.status = 'delivered';
        value.text = 'Doc Component';
        value.createdTime = Date.now();
        value.updatedTime = Date.now();
        this.socketService.sendMessage(value, this.selectedGroup);
      });
    this.message.reset(this.form);
    event.target.value = '';
  }

  createGroupAuto() {
    this.newGroup.name = 'Consultation room';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.description = 'Chat room for consultation';
    this.newGroup.createdBy = this.selectedUser.id;
    this.newGroup.updatedBy = this.selectedUser.id;
    this.chatService.createGroupAuto(this.newGroup, this.selectedGroup.id)
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  createGroupManual(doctor: DoctorProfiles) {
    this.newGroup.name = 'Consultation room';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.description = 'Chat room for consultation';
    this.newGroup.createdBy = this.selectedUser.id;
    this.newGroup.updatedBy = this.selectedUser.id;
    this.chatService.createGroupManual(this.newGroup, this.selectedGroup.id, doctor.id)
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  // get all groups of the logged in user
  getGroups() {
    setTimeout(() => {
      this.chatService.getGroups(this.userId)
        .subscribe((groups) => {
          if (!this.selectedGroup) {
            this.selectedGroup = groups[0];
          }
          this.getMessage(this.selectedGroup);
          groups.map((group: Group) => {
            this.groups.push(group);
            this.receivedGroupStatus(group);
            if (group.picture) {
              this.chatService.downloadFile(group.picture)
                .subscribe((res) => {
                  res.onloadend = () => {
                    group.picture = res.result;
                    this.ref.detectChanges();
                  };
                });
            } else {
              this.downloadAltPic('group.png');
            }
            this.ref.detectChanges();
          });
        });
    }, 2000);
  }

  getMessage(group: Group) {
    this.chatService.setGroup(group);
    this.selectedGroup = group;
    const size = 20;
    if (this.mySidebar.nativeElement.style.display === 'block') {
      //hides the left sidebar in small screen devices as soon as user selects a group
      this.mySidebar.nativeElement.style.display = 'none';
    }
    if (this.oldGroupId === group.id && !this.groupSelected) {
      // if the selected group is same, then append messages
      this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
        .subscribe((msg) => {
          msg.reverse().map((message: any) => {
            this.messages.push(message);
            this.ref.detectChanges();
            this.scrollToBottom();
          });
        });
    } else if (this.oldGroupId !== group.id) {
      // else if user selects different group, clear the messages from array and load new messages
      this.messages = [];
      this.page = 1;
      this.oldGroupId = group.id;
      this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
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
    this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
      .subscribe((msgs) => {
        msgs.map((message: any) => {
          this.messages.unshift(message);
          this.ref.detectChanges();
        });
      });
  }

  sendMessage({ value }: { value: Message }): void {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
    value.receiverType = 'group';
    value.contentType = 'text';
    value.type = 'text';
    value.picUrl = this.selectedUser.picUrl;
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.createdBy = this.selectedUser.id;
    value.updatedBy = this.selectedUser.id;
    value.status = 'delivered';
    if (value.text.match(/^\s*$/g) || value.text === '' || value.text === null) {
      return;
    } else {
      //make typing emite true so that user can send the next message and emit event immediately
      this.typingEvent = true;
      this.socketService.sendMessage(value, this.selectedGroup);
    }
    this.textArea.nativeElement.addEventListener('keypress', (e: any) => {
      let key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        e.preventDefault();
      }
    });
    this.message.reset();
  }

  receiveMessageFromSocket() {
    this.socketService.receiveMessages()
      .subscribe((msg: any) => {
        if (msg.receiverId === this.selectedGroup.id) {
          this.messages.push(msg);
          //making the alert message null immediately after receiving message from socket
          this.alertMessage = null;
          this.ref.detectChanges();
          this.scrollToBottom();
        } else {
          this.groups.map((group) => {
            if (group.id === msg.receiverId) {
              if (this.unreadMessages[group.id]) {
                this.unreadMessages[group.id]++;
              } else {
                this.unreadMessages[group.id] = 1;
              }
            }
            let unReadObject: any = Object;
            let unreadObjectValues = unReadObject.values(this.unreadMessages);
            let sumOfUnread = unreadObjectValues.reduce((a: number, b: number) => a + b, 0);
            let favicon: any = document.querySelector('head link');
            favicon.href = 'assets/favicon/favicon.png';
            document.querySelector('title').innerText = ` (${sumOfUnread})` + 'Mesomeds';
            this.ref.detectChanges();
          });
        }
      });
  }

  resetMessage(id: any) {
    this.unreadMessages[id] = 0;
    let unReadObject: any = Object;
    let unreadObjectValues = unReadObject.values(this.unreadMessages);
    if (!(unreadObjectValues.find((ojectValue: any) => { return ojectValue !== 0; }))) {
      let favicon: any = document.querySelector('head link');
      favicon.href = 'assets/favicon/favicon-DEV.ico';
      document.querySelector('title').innerText = 'Mesomeds';
    }
  }

  receiveUpdatedMessageFromSocket() {
    this.socketService.receiveUpdatedMessage()
      .subscribe((msg: any) => {
        if (msg.receiverId === this.selectedGroup.id) {
          this.ref.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  // scroll to bottom after a new message or as a new group is selected
  scrollToBottom() {
    const scrollPane: any = this.messageBox.nativeElement;
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

  // call get more messages to get next page of messages
  onScroll() {
    const scrollPane: any = this.messageBox.nativeElement;
    if (scrollPane.scrollTop === 0) {
      this.page = this.page + 1;
      this.getMoreMessages(this.selectedGroup);
    }
  }

  // download a default image for profile image
  downloadAltPic(fileName: string) {
    this.chatService.downloadFile(fileName)
      .subscribe((res) => {
        res.onloadend = () => {
          if (fileName === 'group.png') {
            this.altGroupPic = res.result;
          } else {
            this.altDocPic = res.result;
          }
          this.ref.detectChanges();
        };
      });
  }

  //getDoctors
  getDoctors() {
    if (this.doctorList) {
      this.chatService.getDoctors(this.userId)
        .subscribe((doctors) => {
          doctors.map((doctor: any) => {
            this.doctors.push(doctor);
            if (doctor.picUrl) {
              this.chatService.downloadFile(doctor.picUrl)
                .subscribe((res) => {
                  res.onloadend = () => {
                    doctor.picUrl = res.result;
                    this.ref.detectChanges();
                  };
                });
            } else {
              this.downloadAltPic('doc.png');
            }
          });
        });
    }
    this.doctorList = false;
  }

  // open Video Modal
  video(videoModal: any) {
    this.modalService.open(videoModal);
  }

  //Doctor modal window open method
  openDoctor(doctorModal: any) {
    this.getDoctors();
    this.modalService.open(doctorModal, { size: 'lg' });
  }

  // open the left sidebar
  open() {
    this.mySidebar.nativeElement.style.display = 'block';
  }

  // close the left sidebar
  close() {
    this.mySidebar.nativeElement.style.display = 'none';
  }

  /**
   * delete group_message_map
   */
  delete(message: Message, index: number) {
    if (this.userId === message.senderId) {
      this.socketService.delete(message, index);
    }
  }

  receiveDeletedMessageFromSocket() {
    this.socketService.receiveDeletedMessage()
      .subscribe(object => {
        if (object.result.n) {
          this.messages.splice(object.index, 1);
          this.ref.detectChanges();
          this.alert = true;
          this.socketService.notifyUsers(object.data);
        } else {
          this.alert = false;
        }
      });
  }

  receiveNotification() {
    this.socketService.receiveNotifiedUsers()
      .subscribe((notify: any) => {
        this.alertMessage = notify.message;
      });
  }

  /**
   * for getting all the media messages
   */
  media() {
    let x = window.matchMedia('(min-width: 769px)');
    if (x.matches) {
      this.rightSidebar.nativeElement.style.display = 'block';
      this.chat.nativeElement.style.width = '70%';
      this.ref.detectChanges();
    } else {
      this.rightSidebar.nativeElement.style.display = 'block';
      this.rightSidebar.nativeElement.style.width = '100%';
      this.chat.nativeElement.style.width = '100%';
      this.ref.detectChanges();
    }
    const size = 5;
    this.mediaMessages = [];
    this.chatService.media(this.selectedGroup.id, this.mediaPage, size)
      .subscribe(result => {
        result.map((message: any) => {
          this.mediaMessages.push(message);
          this.ref.detectChanges();
        });
      });
  }
  /**
   *
   * Close the right sidebar on click of close button and resize the chat window to 100% width
   * @memberof ChatComponent
   */
  w3_close() {
    this.rightSidebar.nativeElement.style.display = 'none';
    this.chat.nativeElement.style.width = '100%';
  }

  getMoreMedia() {
    const size = 5;
    this.chatService.media(this.selectedGroup.id, this.mediaPage, size)
      .subscribe(result => {
        result.map((message: any) => {
          debugger;
          this.mediaMessages.push(message);
        });
      });
  }

  // call get more media messages to get next page of media messages
  scroll() {
    let scrollPane = this.rightSidebar.nativeElement;
    if (scrollPane.scrollTop === 0) {
      this.mediaPage = this.mediaPage + 1;
      this.getMoreMedia();
    }
  }

  receivedGroupStatus(group: any) {
    this.socketService.receivedGroupStatus()
      .subscribe((groups: any) => {
        groups.map((updatedGroup: any) => {
          if (updatedGroup[0] !== undefined && updatedGroup[0] !== '' && group.id === updatedGroup[0].id) {
            console.log('status ', updatedGroup[0].status);
            group.status = updatedGroup[0].status;
          }
        });
      });
  }

  endConsultation() {
    this.socketService.userDeleted(this.selectedUser, this.selectedGroup);
    if (this.selectedUser.role === 'doctor') {
      this.groups.splice(1, 1);
      this.selectedGroup = this.groups[0];
      this.getMessage(this.selectedGroup);
      this.ref.detectChanges();
    } else {
      return;
    }
  }

  consultationStatus() {
    this.socketService.receiveUserDeleted()
      .subscribe((response) => {
        this.alert = true;
        this.alertMessage = response.message;
      });
  }
}

