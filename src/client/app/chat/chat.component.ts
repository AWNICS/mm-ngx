import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ProfileService } from '../profile/profile.service';

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
export class ChatComponent implements OnInit, AfterViewInit  {

  @ViewChild('messageBox') messageBox: ElementRef;
  @ViewChild('mySidebar') mySidebar: ElementRef;
  @ViewChild('chat') chat: ElementRef;
  @ViewChild('rightSidebar') rightSidebar: ElementRef;
  @ViewChild('dropDown') dropDown: ElementRef;
  @ViewChild('textArea') textArea: ElementRef;
  @ViewChild('imageUpload') imageUpload: ElementRef;
  @ViewChild('videoUpload') videoUpload: ElementRef;
  @ViewChild('fileUpload') fileUpload: ElementRef;
  @ViewChild('prescriptionComponent') prescriptionComponent: any;
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

  newMessage: any = {
    receiverId: null,
    receiverType: null,
    senderId: null,
    senderName: '',
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
    createdBy: null,
    updatedBy: null,
    lastUpdateTime: Date.now(),
    createdTime: Date.now(),
    updatedTime: Date.now()
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
  errors:Array<any>=[];
  patientDetails:any;
  doctorDetails:any;
  showPrescriptionComponent:Boolean = false;
  digitalSignature:string;
  displayMessageLoader:Boolean ;


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
    private sharedService: SharedService,
    private profileService: ProfileService
  ) {
  }

  ngOnInit(): void {
    this.navbarComponent.navbarColor(0, '#6960FF');
    this.userId = +this.route.snapshot.paramMap.get('userId');
    this.selectedGroup = this.sharedService.getGroup();
    const cookie = this.securityService.getCookie('userDetails');
    this.displayMessageLoader = true;
    if (cookie === '' || this.userId !== JSON.parse(cookie).id) {
      this.router.navigate([`/login`]);
    } else if (this.userId === JSON.parse(cookie).id) {
    //set the socket connection otherwise socket will through a connection error if making an call tosocket service
    //commenting  this for the timebeing. should find an alterantive to reconnect to old socket
      // this.socketService.connection(this.userId);
      this.chatService.getUserById(this.userId)
        .subscribe(user => {
          this.selectedUser = user;
          this.getGroups();
          if(user.role==='doctor') {
            this.downloadDoctorSignature();
            this.getDoctorDetails();
          }
        });
      this.createForm();
      this.receiveMessageFromSocket();
      this.receiveNotification();
      this.receiveUpdatedMessageFromSocket();
      this.receiveDeletedMessageFromSocket();
      this.consultationStatus();
      this.typingEventEmitter();
      this.typingEventListener();
      this.receivedGroupStatus();
      this.listenUserAdded();
      this.listenUserDeleted();
    } else {
      this.router.navigate([`/`]);
    }
  }
  ngAfterViewInit() {
    //to set the chat-history height to 87% of window height minus chatwindow header and chatwindow footer
  let  chatHistoryHeight = (window.innerHeight*87)/100-76-151;
  if(window.innerWidth <= 992) {
    chatHistoryHeight-=46;
  }
  this.messageBox.nativeElement.style.height = chatHistoryHeight+'px';
  }

  errorRead(index: number) {
    this.errors.splice(index, 1);
  }

  listenUserAdded() {
    this.socketService.receiveUserAdded().subscribe((result)=> {
      // this.createMessageNotification(result.message);
    });
  }
  listenUserDeleted() {
    this.socketService.receiveUserDeleted().subscribe((result)=> {
      // this.createMessageNotification(result.message);
    });
  }

  togglePrescriptionComponent() {
    this.showPrescriptionComponent = !Boolean(this.showPrescriptionComponent);
    this.ref.detectChanges();
    if (this.showPrescriptionComponent) {
      this.prescriptionComponent.container.nativeElement.scrollIntoView();
    }
  }

  getDoctorDetails() {
    this.sharedService.getDoctorById(this.userId).subscribe((doctorDetails) => {
      this.doctorDetails = doctorDetails;
    });
  }

  downloadDoctorSignature() {
    this.profileService.getDoctorMedia(this.selectedUser.id).subscribe((doctorMedia) => {
      doctorMedia.map((singleMedia: any) => {
        if (singleMedia.type === 'signature') {
          this.chatService.downloadFile(singleMedia.url).subscribe((res) => {
            res.onloadend = () => {
              this.digitalSignature = res.result;
            };
          });
        }
      });
    });
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
        //this is  to apped the usernames who are typing at a time
        if(this.alertMessage)   {
          let addUserName = this.alertMessage.replace('is typing',`and ${response.userName} are typing`);
          this.alertMessage = addUserName;
        } else {
            this.alertMessage = response.userName + ' is typing ';
          }
        this.ref.markForCheck();
        setTimeout(() => {
          this.alertMessage = null;
          this.alert = false;
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
    value.contentData = { data: ['Yes', 'No', 'May be'] };
    value.status = 'delivered';
    value.text = 'Would you like to visit the doctor in person? ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.updatedBy = this.selectedUser.id;
    value.createdBy = this.selectedUser.id;
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
    value.updatedBy = this.selectedUser.id;
    value.createdBy = this.selectedUser.id;
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
    value.contentData = { data: ['Headache', 'Giddiness', 'Feverish'] };
    value.status = 'delivered';
    value.text = 'Kindly select your observed symptoms: ';
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.updatedBy = this.selectedUser.id;
    value.createdBy = this.selectedUser.id;
    this.socketService.sendMessage(value, this.selectedGroup);
    this.message.reset(this.form);
  }

  createAppear({ value, valid }: { value: Message, valid: boolean }) {
    value.contentData = {data:[`https://appear.in/${this.selectedUser.firstname}-${this.selectedUser.lastname}`]};
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
    value.updatedBy = this.selectedUser.id;
    value.createdBy = this.selectedUser.id;
    this.socketService.sendMessage(value, this.selectedGroup);
    this.message.reset(this.form);
  }

  createImage(event: any, { value }: { value: Message }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let images: FileList = event.target.files;
    let result = this.sharedService.validateFileUpload(images[0].name, 'image');
    if (result.message) {
      this.chatService.uploadFile(images[0])
        .subscribe(res => {
          //mrch for check erro
          value.contentData = {data: res._body};
          value.receiverId = this.chatService.getGroup().id;
          value.senderId = this.selectedUser.id;
          value.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
          value.receiverType = 'group';
          value.contentType = 'image';
          value.type = 'image';
          value.status = 'delivered';
          value.text = 'Image Component';
          value.updatedBy = this.selectedUser.id;
          value.createdBy = this.selectedUser.id;
          value.createdTime = Date.now();
          value.updatedTime = Date.now();
          this.socketService.sendMessage(value, this.selectedGroup);
        });
      this.message.reset(this.form);
      event.target.value = '';
    } else {
      let error = 'Upload Failed. Please try uploading jpg or png file again';
      this.errors.push(error);
      this.imageUpload.nativeElement.value = null;
    }
  }

  createVideo(event: any, { value, valid }: { value: Message, valid: boolean }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let videos: FileList = event.target.files;
    let result = this.sharedService.validateFileUpload(videos[0].name, 'video');
    if (result.message) {
      this.chatService.uploadFile(videos[0])
        .subscribe(res => {
          value.contentData = {data:res._body};
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
          value.updatedBy = this.selectedUser.id;
          value.createdBy = this.selectedUser.id;
          this.socketService.sendMessage(value, this.selectedGroup);
        });
      this.message.reset(this.form);
      event.target.value = '';
    } else {
      let error = 'Upload Failed. Please try uploading mp4 or avi file again';
      this.errors.push(error);
      this.videoUpload.nativeElement.value = null;
    }
  }

  createPrescription(data: any) {
    let value: any = { contentData: { data: '' } };
    this.chatService.generatePdf(data, this.selectedUser.id).subscribe((fileName) => {
      value.contentData.data = fileName.fileName;
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
      value.updatedBy = this.selectedUser.id;
      value.createdBy = this.selectedUser.id;
      this.showPrescriptionComponent = false;
      this.ref.markForCheck();
      this.socketService.sendMessage(value, this.selectedGroup);
    });
  }

  createFile(event: any, { value, valid }: { value: Message, valid: boolean }) {
    let el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    let files: FileList = event.target.files;
    let result = this.sharedService.validateFileUpload(files[0].name, 'file');
    if (result.message) {
      this.chatService.uploadFile(files[0])
        .subscribe(res => {
          value.contentData = {data:res._body};
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
          value.updatedBy = this.selectedUser.id;
          value.createdBy = this.selectedUser.id;
          this.socketService.sendMessage(value, this.selectedGroup);
        });
      this.message.reset(this.form);
      event.target.value = '';
    } else {
      let error = 'Upload Failed. Please try uploading pdf file again';
      this.errors.push(error);
      this.fileUpload.nativeElement.value = null;
    }
  }

  createMessageNotification(Message:string) {
    let value:any = {};
    value.receiverId = this.chatService.getGroup().id;
    console.log(value.receiverId);
    value.senderId = this.selectedUser.id;
    value.senderName = this.selectedUser.firstname+' '+this.selectedUser.lastname;
    value.receiverType = 'group';
    value.contentType = 'notification';
    value.type = 'notification';
    value.status = 'delivered';
    value.text = Message;
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.updatedBy = this.selectedUser.id;
    value.createdBy = this.selectedUser.id;
    this.socketService.sendMessage(value, this.selectedGroup);
    console.log('sent');
    this.message.reset(this.form);
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
    this.chatService.getGroups(this.userId)
      .subscribe((groups) => {
        if(groups) {
          if (!this.selectedGroup) {
            this.selectedGroup = groups[0];
            this.getMessage(this.selectedGroup);
          } else {
            this.getMessage(this.selectedGroup);
          }
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
        } else {
          return;
        }
      });
  }

  getMessage(group: Group) {
    this.chatService.setGroup(group);
    this.chatService.getUsersByGroupId(group.id).subscribe((users) => {
      this.patientDetails = null;
      users.map((user: any) => {
        if (user.role === 'patient') {
          this.patientDetails = user;
        }
      });
    });
    this.selectedGroup = group;
    const size = 20;
    if (this.mySidebar.nativeElement.style.display === 'block') {
      //hides the left sidebar in small screen devices as soon as user selects a group
      this.mySidebar.nativeElement.style.display = 'none';
    }
    if (this.oldGroupId === group.id && !this.groupSelected && this.selectedUser) {
      // if the selected group is same, then append messages
      this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
        .subscribe((msg) => {
          msg.reverse().map((message: any) => {
            this.messages.push(message);
          });
          this.displayMessageLoader = false;
          this.ref.detectChanges();
          this.scrollToBottom();
        });
    } else if (this.oldGroupId !== group.id) {
      //display  loading animaton upon message call in the intitial chat window load
       this.displayMessageLoader = true;
      // else if user selects different group, clear the messages from array and load new messages
      this.messages = [];
      this.page = 1;
      this.oldGroupId = group.id;
      this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
        .subscribe((msg) => {
          msg.reverse().map((message: any) => {
            this.messages.push(message);
          });
          this.displayMessageLoader = false;
          this.ref.detectChanges();
          this.scrollToBottom();
        });
    } else {
      // return 0 if user selects same group more than once
      return;
    }
    this.groupSelected = true;
  }

  getMoreMessages(group: Group) {
    const size = 20;
    let height = this.messageBox.nativeElement.scrollHeight;
    this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
      .subscribe((msgs) => {
        msgs.map((message: any) => {
          this.messages.unshift(message);
        });
        this.ref.detectChanges();
        //this is to prevent the scroll reaching to top when messages are loaded, ideally it shouldbe in same place
        this.messageBox.nativeElement.scrollTo(0,this.messageBox.nativeElement.scrollHeight-height);
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
          this.alert = false;
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
            this.ref.markForCheck();
          });
        }
        if(msg.senderId !== this.selectedUser.id) {
        this.sharedService.createWebNotification('New Message from '+msg.senderName, msg.text);
        }
      });
  }

  resetMessage(id: any) {
    //this below step is to hide prescrition component on group change or group icon click
    this.showPrescriptionComponent = false;
    this.unreadMessages[id] = 0;
    let unReadObject: any = Object;
    let unreadObjectValues = unReadObject.values(this.unreadMessages);
    if (!(unreadObjectValues.find((ojectValue: any) => { return ojectValue !== 0; }))) {
      let favicon: any = document.querySelector('head link');
      favicon.href = 'assets/favicon/favicon-DEV.png';
      document.querySelector('title').innerText = 'Mesomeds';
    }
  }

  receiveUpdatedMessageFromSocket() {
    this.socketService.receiveUpdatedMessage()
      .subscribe((res: any) => {
        if (res.message.receiverId === this.selectedGroup.id) {
          this.messages[res.index] = res.message; // updates the message in the messages array
          this.ref.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  addNewEntry(event: any) {
    if (!event.value) { return; }
    this.newMessage.text = event.value;
    this.newMessage.receiverId = this.chatService.getGroup().id;
    this.newMessage.senderId = this.selectedUser.id;
    this.newMessage.senderName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
    this.newMessage.picUrl = this.selectedUser.picUrl;
    this.newMessage.receiverType = 'group';
    this.newMessage.contentType = 'text';
    this.newMessage.type = 'text';
    this.newMessage.createdBy = this.selectedUser.id;
    this.newMessage.updatedBy = this.selectedUser.id;
    this.newMessage.lastUpdateTime = Date.now(),
      this.newMessage.createdTime = Date.now();
    this.newMessage.updatedTime = Date.now();
    this.newMessage.status = 'delivered';
    if (this.newMessage.text === '') {
      return;
    } else {
      this.socketService.sendMessage(this.newMessage, this.selectedGroup);
    }
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

  receivedGroupStatus() {
    this.socketService.receivedGroupStatus()
      .subscribe((groupUpdate => {
        this.groups.map((group: any) => {
          if(groupUpdate.groupId === group.id) {
            group.status = groupUpdate.groupStatus;
          }
          this.ref.markForCheck();
         });
        }));
  }

  endConsultation() {
    this.socketService.userDeleted(this.selectedUser, this.selectedGroup);
    if (this.selectedUser.role === 'doctor') {
      // this.groups.splice(1, 1);
      // this.selectedGroup = this.groups[0];
      // this.getMessage(this.selectedGroup);
      // this.ref.detectChanges();
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

