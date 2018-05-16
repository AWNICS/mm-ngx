import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { SocketService } from './socket.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from './chat.service';
import { Group } from '../shared/database/group';
import { Message } from '../shared/database/message';
import { DoctorDetails } from '../shared/database/doctor-details';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';

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
  @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
  @ViewChild('chat') chat: ElementRef;
  @ViewChild('rightSidebar') rightSidebar: ElementRef;
  @ViewChild('dropDown') dropDown: ElementRef;

  userId: number; // to initialize the user logged in
  selectedUser: UserDetails;
  selectedGroup: Group;
  groups: Group[] = [];
  messages: Message[] = [];
  message: FormGroup;
  oldGroupId = 1;
  page = 1;
  groupSelected = false;
  doctors: DoctorDetails[] = [];
  doctorList = true; //for listing down the doctors in modal window
  searchText: string;
  searchFile: string;
  online = false;
  altGroupPic: string;
  altDocPic: string;
  alert: boolean = false;
  alertMessage: string; //alert for deleted message
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
    private domSanitizer: DomSanitizer,
    private modalService: NgbModal,
    private securityService: SecurityService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userId = +this.route.snapshot.paramMap.get('userId');
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
          if (user.status === 'online') {
            this.securityService.setLoginStatus(true);
            this.online = true;
            this.ref.detectChanges();
          } else {
            this.online = false;
            this.ref.detectChanges();
          }
        });
      this.socketService.connection(this.userId);
      this.getGroups();
      this.createForm();
      this.receiveMessageFromSocket();
      this.receiveNotification();
      this.receiveUpdatedMessageFromSocket();
      this.receiveDeletedMessageFromSocket();
      this.navbarComponent.navbarColor(0, '#6960FF');
    } else {
      this.router.navigate([`/`]);
    }
  }

  createForm() {
    this.message = this.fb.group(this.form);
  }

  createRadio({ value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.receiverType = 'group';
    value.contentType = 'radio';
    value.type = 'radio';
    value.contentData.data = ['Yes', 'No', 'May be'];
    value.status = 'delivered';
    value.text = 'Would you like to visit the doctor in person? ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value);
    this.message.reset(this.form);
  }

  createSlider(type: string, { value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.receiverType = 'group';
    value.contentType = 'slider';
    value.type = type;
    value.status = 'delivered';
    value.text = 'Kindly choose a number from 0 to 10: ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value);
    this.message.reset(this.form);
  }

  createCheckbox({ value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.receiverType = 'group';
    value.contentType = 'checkbox';
    value.type = 'checkbox';
    value.contentData.data = ['Headache', 'Giddiness', 'Feverish'];
    value.status = 'delivered';
    value.text = 'Kindly select your observed symptoms: ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value);
    this.message.reset(this.form);
  }

  createAppear({ value, valid }: { value: Message, valid: boolean }) {
    value.receiverId = this.chatService.getGroup().id;
    value.senderId = this.selectedUser.id;
    value.receiverType = 'group';
    value.contentType = 'appear';
    value.type = 'appear';
    value.status = 'delivered';
    value.text = 'Appear Component';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    this.socketService.sendMessage(value);
    this.message.reset(this.form);
  }

  createImage(event: any, { value }: { value: Message }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let images: FileList = event.target.files;
    this.chatService.uploadFile(images)
      .subscribe(res => {
        value.contentData.data = res._body;
        value.receiverId = this.chatService.getGroup().id;
        value.senderId = this.selectedUser.id;
        value.receiverType = 'group';
        value.contentType = 'image';
        value.type = 'image';
        value.status = 'delivered';
        value.text = 'Image Component';
        value.createdTime = Date.now();
        value.updatedTime = Date.now();
        this.socketService.sendMessage(value);
      });
    this.message.reset(this.form);
    event.target.value= '';
  }

  createVideo(event: any, { value, valid }: { value: Message, valid: boolean }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let videos: FileList = event.target.files;
    this.chatService.uploadFile(videos)
      .subscribe(res => {
        value.contentData.data = res._body;
        value.receiverId = this.chatService.getGroup().id;
        value.senderId = this.selectedUser.id;
        value.receiverType = 'group';
        value.contentType = 'video';
        value.type = 'video';
        value.status = 'delivered';
        value.text = 'Video Component';
        value.createdTime = Date.now();
        value.updatedTime = Date.now();
        this.socketService.sendMessage(value);
      });
    this.message.reset(this.form);
    event.target.value= '';
  }

  createFile(event:any, { value, valid }: { value: Message, valid: boolean }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let files: FileList = event.target.files;
    this.chatService.uploadFile(files)
      .subscribe(res => {
        value.contentData.data = res._body;
        value.receiverId = this.chatService.getGroup().id;
        value.senderId = this.selectedUser.id;
        value.receiverType = 'group';
        value.contentType = 'doc';
        value.type = 'doc';
        value.status = 'delivered';
        value.text = 'Doc Component';
        value.createdTime = Date.now();
        value.updatedTime = Date.now();
        this.socketService.sendMessage(value);
      });
    this.message.reset(this.form);
    event.target.value= '';
  }

  createGroupAuto() {
    this.newGroup.name = 'Consultation room';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.description = 'Chat room for consultation';
    this.newGroup.createdBy = this.selectedUser.firstname + this.selectedUser.lastname;
    this.newGroup.updatedBy = this.selectedUser.firstname + this.selectedUser.lastname;
    this.chatService.createGroupAuto(this.newGroup, this.selectedGroup.id)
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  createGroupManual(doctor: DoctorDetails) {
    this.newGroup.name = 'Consultation room';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.description = 'Chat room for consultation';
    this.newGroup.createdBy = this.selectedUser.firstname + this.selectedUser.lastname;
    this.newGroup.updatedBy = this.selectedUser.firstname + this.selectedUser.lastname;
    this.chatService.createGroupManual(this.newGroup, this.selectedGroup.id, doctor.id)
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  // get all groups of the logged in user
  getGroups() {
    this.chatService.getGroups(this.userId)
      .subscribe((groups) => {
        this.selectedGroup = groups[0];
        this.getMessage(this.selectedGroup);
        groups.map((group: Group) => {
          this.groups.push(group);
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
  }

  getMessage(group: Group) {
    this.chatService.setGroup(group);
    this.selectedGroup = group;
    const size = 20;
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
    value.receiverType = 'group';
    value.contentType = 'text';
    value.type = 'text';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.status = 'delivered';
    if (value.text.match(/^\s*$/g) || value.text === '' || value.text === null) {
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

  // open the slider
  open() {
    this.mySidebar.nativeElement.style.display = 'block';
  }

  // close the slider
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
    } else {
      this.rightSidebar.nativeElement.style.display = 'block';
      this.rightSidebar.nativeElement.style.width = '100%';
      this.chat.nativeElement.style.width = '100%';
    }
    const size = 5;
    this.mediaMessages = [];
    this.chatService.media(this.selectedGroup.id, this.mediaPage, size)
      .subscribe(result => {
        result.map((message: any) => {
          this.mediaMessages.push(message);
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

  getMoreMedia(group: Group) {
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
      this.getMoreMedia(this.selectedGroup);
    }
  }
}

