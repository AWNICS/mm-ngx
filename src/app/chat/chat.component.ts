import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
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
import { ProfileService } from '../profile/profile.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// const moment = require('moment');
import * as moment from 'moment';

/**
 * This class represents the lazy loaded ChatComponent.
 */
@Component({
  selector: 'app-chat',
  templateUrl: 'chat.component.html',
  styleUrls: ['chat.component.css', 'w3schools.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatComponent implements OnInit, AfterViewInit, OnDestroy {

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
  @ViewChild('prescriptionGeneration') prescriptionGeneration: ElementRef;

  userId: number; // to initialize the user logged in
  selectedUser: UserDetails;
  selectedGroup: Group;
  groups: Group[] = [];
  messages: Message[] = [];
  message: FormGroup;
  oldGroupId = 0;
  page = 1;
  groupSelected = false;
  doctors: DoctorProfiles[] = [];
  doctorList = true; // for listing down the doctors in modal window
  searchText: string;
  searchFile: string;
  altGroupPic: string;
  altDocPic: string;
  alert = false;
  alertMessage: string; // alert for deleted message and doctor exit
  fileUrl: SafeResourceUrl;
  mediaMessages: Message[] = [];
  mediaPage = 1;
  activeGroups: Group[] = [];
  inactiveGroups: Group[] = [];
  archiveGroups: Group[] = [];
  showGroup = true;
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
    details: null,
    picture: '',
    status: '',
    phase: '',
    prescription_generated: false,
    unreadCount: null,
    createdBy: null,
    updatedBy: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  window: any;
  typingEvent: Boolean = true;
  errors: Array<any> = [];
  patientDetails: any;
  doctorDetails: any;
  showPrescriptionComponent: Boolean = false;
  digitalSignature: string;
  displayMessageLoader: Boolean ;
  userDetails: any;
  prescriptionGenerated: any = {};
  initialLoad: Boolean = true;
  gettingMessages: Boolean;
  @Output() unreadMessageCount = 0;
  // this new variable is to unsubscribe all socket calls on component destruction
  private unsubscribeObservables: any = new Subject();

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
    this.window = window;
    // this.navbarComponent.navbarColor(0, '#6960FF');
    this.userId = +this.route.snapshot.paramMap.get('userId');
    this.selectedGroup = this.sharedService.getGroup();
    console.log('this.selectedGroup');
    console.log(this.selectedGroup);
    const cookie = this.securityService.getCookie('userDetails');
    this.displayMessageLoader = true;
    if (cookie === '' || this.userId !== JSON.parse(cookie).id) {
      this.router.navigate([`/login`]);
    } else if (this.userId === JSON.parse(cookie).id) {
      this.userDetails = JSON.parse(cookie);
      // set the socket connection otherwise socket will through a connection error if making an call tosocket service
      // commenting  this for the timebeing. should find an alterantive to reconnect to old socket
      if (window.localStorage.getItem('pageReloaded') === 'true') {
        console.log('Page Reloaded');
        this.socketService.connection(this.userId);
      }
      this.chatService.getUserById(this.userId)
      .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((user: any) => {
          this.selectedUser = user;
          this.getGroups();
          if (user.role === 'doctor') {
            this.downloadDoctorSignature();
            this.getDoctorDetails();
          }
        });
      this.createForm();
      this.receiveMessageFromSocket();
      this.receiveNotification();
      this.receiveUpdatedMessageFromSocket();
      this.receiveDeletedMessageFromSocket();
      // this.consultationStatus();
      this.typingEventEmitter();
      this.typingEventListener();
      this.receivedGroupStatus();
      this.socketMedia(); // required for real time change in all file section
      this.listenUserAdded();
      this.receiveEndConsultation();
      this.listenClicksOnChat();
      this.listenMessageRead();
      this.receiveSyncCount();
    } else {
      this.router.navigate([`/`]);
    }
  }
  ngAfterViewInit() {
    // to set the chat-history height to 87% of window height minus chatwindow header and chatwindow footer
  let  chatHistoryHeight = (window.innerHeight * 87) / 100 - 76 - 151;
  if (window.innerWidth <= 992) {
    chatHistoryHeight -= 46;
  }
  this.messageBox.nativeElement.style.height = chatHistoryHeight + 'px';
  }

  ngOnDestroy() {
    this.unsubscribeObservables.next();
    this.unsubscribeObservables.complete();
    const favicon: any = document.querySelector('head link');
    favicon.href = 'assets/favicon/favicon-DEV.png';
    document.querySelector('title').innerText = 'Mesomeds';
  }

  errorRead(index: number) {
    this.errors.splice(index, 1);
  }

  listenClicksOnChat() {
    this.chat.nativeElement.addEventListener('click', (event: any) => {
      this.mySidebar.nativeElement.style.display = 'none';
      const element: any = document.querySelector('app-navbar #navbarSupportedContent');
      if (element.className === 'navbar-collapse collapse show') {
        element.className = 'navbar-collapse collapse';
      }
    });
  }

  listenMessageRead() {
    this.socketService.receiveMessageread()
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((groupId: number) => {
      this.activeGroups.map((activeGroup: any) => {
        if (activeGroup.id === groupId) {
          this.unreadMessageCount -= activeGroup.unreadCount;
          activeGroup.unreadCount = 0;
        }
      });
      this.inactiveGroups.map((inactiveGroup: any) => {
        if (inactiveGroup.id === groupId) {
          this.unreadMessageCount -= inactiveGroup.unreadCount;
          inactiveGroup.unreadCount = 0;
        }
      });
      this.socketService.emitCountSync(this.selectedUser.id, this.unreadMessageCount, groupId);
      const favicon: any = document.querySelector('head link');
      if (this.unreadMessageCount > 0 && favicon.href.match(/favicon-dev.png/i)) {
        favicon.href = 'assets/favicon/favicon.png';
        document.querySelector('title').innerText = `(${this.unreadMessageCount}) ` + 'Messages';
      } else if (this.unreadMessageCount === 0) {
        const favicon1: any = document.querySelector('head link');
        favicon1.href = 'assets/favicon/favicon-DEV.png';
        document.querySelector('title').innerText = 'Mesomeds';
      }
      this.ref.markForCheck();
    });
  }
  receiveSyncCount() {
    this.socketService.receiveCountSync()
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((data: any) => {
        this.unreadMessageCount = data.count;
        this.activeGroups.map((activeGroup: any) => {
          if (activeGroup.id === data.groupId) {
            activeGroup.unreadCount = 0;
          }
        });
        this.inactiveGroups.map((inactiveGroup: any) => {
          if (inactiveGroup.id === data.groupId) {
            inactiveGroup.unreadCount = 0;
          }
        });
        if (this.unreadMessageCount === 0) {
        const favicon: any = document.querySelector('head link');
        favicon.href = 'assets/favicon/favicon-DEV.png';
        document.querySelector('title').innerText = 'Mesomeds';
        }
    });
}

  listenUserAdded() {
    this.socketService.receiveUserAdded()
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((result) => {
      if (this.userDetails.role === 'patient') {
        let i = 0;
        this.inactiveGroups.map((group: any) => {
          i++;
          if (group.id === result.group.id) {
            const activeGroup: any = this.inactiveGroups.splice(i - 1, 1)[0];
            this.activeGroups.push(activeGroup);
          }
        });
        this.sharedService.createWebNotification('Consultaion scheduled', 'Doctor arrived for you scheduled consultation please join soon');
      }
    });
  }

  receiveEndConsultation() {
    this.socketService.receiveEndConsultation()
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((result) => {
      const socketId = this.socketService.getSocketId();
            if (this.selectedUser.role === 'doctor' && result.socketId === socketId) {
              this.createNotificationMessage(result.message, result.groupId);
              setTimeout(() => { this.router.navigate([`dashboards/doctors/${this.selectedUser.id}`]); }, 2000);
            } else if (this.selectedUser.role === 'patient') {
              let i = 0;
              this.activeGroups.map((group: any) => {
                i++;
                if (group.id === result.groupId) {
                  const inactiveGroup: any = this.activeGroups.splice(i - 1, 1)[0];
                  this.inactiveGroups.unshift(inactiveGroup);
                }
              });
              // to change the group and get messages of new group i.e Medhelp
              this.chatService.setGroup(this.activeGroups[0]);
              this.selectedGroup = this.chatService.getGroup();
              this.getMessage(this.selectedGroup);
              this.ref.markForCheck();
            }
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
    this.sharedService.getDoctorById(this.userId)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((doctorDetails) => {
        this.doctorDetails = doctorDetails;
      });
  }

  downloadDoctorSignature() {
    this.profileService.getDoctorDigitalSignature(this.selectedUser.id)
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((digitalSignature: any) => {
      if (digitalSignature) {
          this.chatService.downloadFile(digitalSignature.url)
          .pipe(takeUntil(this.unsubscribeObservables))
          .subscribe((res) => {
            res.onloadend = () => {
              this.digitalSignature = res.result;
            };
          });
        }
    });
  }

  typingEventEmitter() {
    this.textArea.nativeElement.addEventListener('input', (event: any) => {
      if (event.target.value.length === 1) {
        event.target.value = event.target.value.toUpperCase();
      }
      if (this.typingEvent) {
        this.typingEvent = false;
        const fullName = this.selectedUser.firstname + ' ' + this.selectedUser.lastname;
        this.socketService.typingEmitter(this.selectedGroup.id, fullName, false);
        setTimeout(() => {
          this.typingEvent = true;
        }, 8000);
      }
    });
  }

  typingEventListener() {
    this.socketService.typingListener()
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((response) => {
      if (this.selectedGroup.id === response.groupId) {
        this.alert = true;
        // this is  to apped the usernames who are typing at a time
        if (response.prescription)   {
           if (this.userDetails.role === 'patient') {
            this.alertMessage = 'Dr. ' + response.userName + ' is generating prescription for you ';
           }
        } else {
          this.alertMessage = this.userDetails.role === 'patient' ? 'Dr. ' + response.userName + ' is typing '
           : response.userName + ' is typing ';
        }
        // commented for time being as there are no multiple users
        // else if (this.alertMessage) {
        //   let addUserName = this.alertMessage.replace('is typing',`and ${response.userName} are typing`);
        //   this.alertMessage = addUserName;
        // }
        this.ref.markForCheck();
        setTimeout(() => {
          // this.alertMessage = null;
          // this.alert = false;
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
    value.contentData = { data: this.doctorDetails.doctorDetails.appearUrl };
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
    const el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    const images: FileList = event.target.files;
    const result = this.sharedService.validateFileUpload(images[0].name, 'image');
    if (result.message) {
      this.chatService.uploadFile(images[0])
      .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe(res => {
          // mrch for check erro
          value.contentData = { data: res.fileName };
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
      const error = 'Upload Failed. Please try uploading jpg or png file again';
      this.errors.push(error);
      this.imageUpload.nativeElement.value = null;
    }
  }

  createVideo(event: any, { value, valid }: { value: Message, valid: boolean }) {
    const el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    const videos: FileList = event.target.files;
    const result = this.sharedService.validateFileUpload(videos[0].name, 'video');
    if (result.message) {
      this.chatService.uploadFile(videos[0])
      .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe(res => {
          value.contentData = { data: res.fileName };
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
      const error = 'Upload Failed. Please try uploading mp4 or avi file again';
      this.errors.push(error);
      this.videoUpload.nativeElement.value = null;
    }
  }

  createPrescription(data: any) {
    const value: any = { contentData: { data: '' } };
    const buttonLink: any = document.querySelector('app-prescription button');
    buttonLink.disabled = true;
    this.chatService.generatePdf(data, this.selectedUser.id, this.chatService.getGroup().id)
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((fileName) => {
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
      this.selectedGroup.prescription_generated = true;
      this.activeGroups.map((activeGroup) => {
        if (activeGroup.id === this.selectedGroup.id) {
          activeGroup.prescription_generated = true;
        }
      });
      this.socketService.sendMessage(value, this.selectedGroup);
      // this.updatePrescriptionUrl(fileName);
    },
    (err) => {
      buttonLink.disabled = false;
      const error = 'Something went wrong please try generating prescription again';
      this.errors.push(error);
    }
    );
  }

  createFile(event: any, { value, valid }: { value: Message, valid: boolean }) {
    const el: HTMLElement = this.dropDown.nativeElement as HTMLElement;
    el.click(); // to hide the dropup menu
    const files: FileList = event.target.files;
    const result = this.sharedService.validateFileUpload(files[0].name, 'file');
    if (result.message) {
      this.chatService.uploadFile(files[0])
      .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe(res => {
          value.contentData = { data: res._body };
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
      const error = 'Upload Failed. Please try uploading pdf file again';
      this.errors.push(error);
      this.fileUpload.nativeElement.value = null;
    }
  }

  createNotificationMessage(Message1: string, groupId: number) {
    const value: any = {};
    value.receiverId = groupId;
    value.senderId = this.userDetails.id;
    value.senderName = this.userDetails.firstname + ' ' + this.userDetails.lastname;
    value.receiverType = 'group';
    value.contentType = 'notification';
    value.type = 'notification';
    value.status = 'delivered';
    value.text = Message1;
    value.createdTime = Date.now();
    value.updatedTime = Date.now();
    value.updatedBy = this.userDetails.id;
    value.createdBy = this.userDetails.id;
    const group: any = { id: groupId };
    this.socketService.sendMessage(value, group);
    console.log('Created Message Notification');
  }

  createGroupAuto() {
    this.newGroup.name = 'Consultation room';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.details.description = 'Chat room for consultation';
    this.newGroup.details.speciality = this.sharedService.getSpeciality();
    this.newGroup.createdBy = this.selectedUser.id;
    this.newGroup.updatedBy = this.selectedUser.id;
    this.chatService.createGroupAuto(this.newGroup, this.selectedGroup.id)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  createGroupManual(doctor: DoctorProfiles) {
    this.newGroup.name = 'Consultation room';
    this.newGroup.userId = this.selectedUser.id;
    this.newGroup.url = this.newGroup.name + '/' + this.selectedUser.id;
    this.newGroup.details.description = 'Chat room for consultation';
    this.newGroup.details.speciality = this.sharedService.getSpeciality();
    this.newGroup.createdBy = this.selectedUser.id;
    this.newGroup.updatedBy = this.selectedUser.id;
    this.chatService.createGroupManual(this.newGroup, this.selectedGroup.id, doctor.id)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((group) => {
        this.groups.push(group);
        this.ref.detectChanges();
      });
  }

  // get all groups of the logged in user
  getGroups() {
    this.showGroup = true;
    console.log(this.userId);
    this.chatService.getGroups(this.userId)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((groups) => {
        console.log(groups);
        if (groups) {
          console.log(groups);
          const activeGroupParam = this.route.snapshot.queryParams['active_group'];
          const inactiveGroupParam = this.route.snapshot.queryParams['inactive_group'];
          if ( activeGroupParam || inactiveGroupParam ) {
            groups.activeGroups.map((activeGroup: any) => {
              if (activeGroupParam) {
                if (activeGroup.id === parseInt(this.route.snapshot.queryParams['active_group'], 10)) {
                  this.selectedGroup = activeGroup;
               }
              }
            });
            groups.inactiveGroups.map((inactiveGroup: any) => {
            if (activeGroupParam) {
                if (inactiveGroup.id === parseInt(this.route.snapshot.queryParams['active_group'], 10)) {
                  this.selectedGroup = inactiveGroup;
              }
            }
            if (inactiveGroupParam) {
              if (inactiveGroup.id === parseInt(inactiveGroupParam, 10)) {
                this.selectedGroup = inactiveGroup;
              }
            }
            });
          }
          this.activeGroups = groups.activeGroups;
          this.inactiveGroups = groups.inactiveGroups;
          if (!this.selectedGroup) {
            if (this.activeGroups[1]) {
              this.selectedGroup = this.activeGroups[1];
            } else {
              this.selectedGroup = this.activeGroups[0];
            }
            console.log(this.selectedGroup);
            this.getMessage(this.selectedGroup);
          } else {
            this.getMessage(this.selectedGroup);
          }
          // for active groups unreadcount
          this.activeGroups.map((group: Group) => {
            this.unreadMessageCount += group.unreadCount;
            if (group.picture) {
               this.chatService.downloadFile(group.picture)
               .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe((res) => {
                  console.log(res);
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
          // for inactive groups unreadCount
          this.inactiveGroups.map((group: Group) => {
            this.unreadMessageCount += group.unreadCount;
            if (group.picture) {
              this.chatService.downloadFile(group.picture)
              .pipe(takeUntil(this.unsubscribeObservables))
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
      const favicon: any = document.querySelector('head link');
      if (this.unreadMessageCount > 0 && favicon.href.match(/favicon-dev.png/i)) {
        favicon.href = 'assets/favicon/favicon.png';
        document.querySelector('title').innerText = `(${this.unreadMessageCount}) ` + 'Messages';
      }
        } else {
          return;
        }
      });
  }

  getArchivedGroups() {
    this.showGroup = false;
    this.archiveGroups = [];
    this.chatService.getArchivedGroups(this.userId)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((groups) => {
        if (groups) {
          this.selectedGroup = this.groups[0];
          if (!this.selectedGroup) {
            this.selectedGroup = groups[0];
            this.getMessage(this.selectedGroup);
          } else {
            this.getMessage(this.selectedGroup);
          }
          groups.map((group: Group) => {
            this.archiveGroups.push(group);
            if (group.picture) {
              this.chatService.downloadFile(group.picture)
              .pipe(takeUntil(this.unsubscribeObservables))
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

  toggleGroup() {
    if (this.showGroup) {
      this.showGroup = false;
    } else {
      this.showGroup = true;
      this.selectedGroup = this.activeGroups[0];
      this.getMessage(this.selectedGroup);
    }
  }

  getMessage(group: Group) {
    if ( this.rightSidebar.nativeElement.style.display === 'block') {
        this.rightSidebar.nativeElement.style.display = 'none';
        this.chat.nativeElement.style.width = '100%';
    }
    this.chatService.setGroup(group);
    this.alert = false;
    this.chatService.getUsersByGroupId(group.id)
    .pipe(takeUntil(this.unsubscribeObservables))
    .subscribe((users) => {
      this.patientDetails = null;
      users.map((user: any) => {
        if (user.role === 'patient') {
          this.patientDetails = user;
        }
      });
    });
    this.selectedGroup = group;
    if (this.selectedGroup.phase === 'archive') {
      this.textArea.nativeElement.disabled = true;
    } else {
      this.textArea.nativeElement.disabled = false;
    }
    const size = 20;
    if (this.mySidebar.nativeElement.style.display === 'block') {
      // hides the left sidebar in small screen devices as soon as user selects a group
      this.mySidebar.nativeElement.style.display = 'none';
    }
    // if (this.oldGroupId === group.id && !this.groupSelected && this.selectedUser) {
    //   // if the selected group is same, then append messages
    //   this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
    //   .takeUntil(this.unsubscribeObservables)
    //     .subscribe((msg) => {
    //       let i =0;
    //       msg.reverse().map((message: any) => {
    //         if(i > (19-group.unreadCount)) {
    //           message.receivedNow = true;
    //         }
    //         i++;
    //         this.messages.push(message);
    //       });
    //       console.log(group.unreadCount);
    //       if(group.unreadCount > 0) {
    //         console.log('made nyull');
    //         this.socketService.emitMessageRead(group.id,this.selectedUser.id);
    //       }
    //       let result:any = this.sharedService.getdoctorAddedGroup();
    //       if(result && this.selectedUser.role ==='doctor') {
    //         //add user role doctor filter after verifying integrity
    //        this.createNotificationMessage(result.message,result.groupId);
    //        this.sharedService.doctorAddedToGroup(null);
    //       }
    //       this.displayMessageLoader = false;
    //       this.ref.detectChanges();
    //       this.scrollToBottom();
    //     });
    // } else
    if (this.oldGroupId !== group.id && this.selectedUser) {
      console.log('calling messages');
      // display  loading animaton upon message call in the intitial chat window load
      this.displayMessageLoader = true;
      // else if user selects different group, clear the messages from array and load new messages
      this.message.reset();
      this.messages = [];
      this.page = 1;
      this.oldGroupId = group.id;
      this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
        .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((msg) => {
          let i = 0;
          console.log(msg);
          msg.reverse().map((message: any) => {
            if (i > (19 - group.unreadCount)) {
              message.receivedNow = true;
            }
            i++;
            this.messages.push(message);
          });
          if (group.unreadCount > 0) {
            this.socketService.emitMessageRead(group.id, this.selectedUser.id);
          }
          // this is to check if the doctor-added event is listened to trigger a notificaation message
          const result: any = this.sharedService.getdoctorAddedGroup();
          const socketId = this.socketService.getSocketId();
            if (result && this.selectedUser.role === 'doctor' && result.socketId === socketId) {
              // add user role doctor filter after verifying integrity
             this.createNotificationMessage(result.message, result.group.id);
             this.sharedService.doctorAddedToGroup(null);
            }
          this.displayMessageLoader = false;
          this.ref.detectChanges();
          this.scrollToBottom();
        });
    } else {
      // return 0 if user selects same group more than once
      return;
    }
    // this.groupSelected = true;
  }

  getMoreMessages(group: Group) {
    const size = 20;
    const height = this.messageBox.nativeElement.scrollHeight;
    this.chatService.getMessages(this.selectedUser.id, group.id, this.page, size)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((msgs) => {
        msgs.map((message: any) => {
          this.messages.unshift(message);
        });
        this.ref.detectChanges();
        // this is to prevent the scroll reaching to top when messages are loaded, ideally it shouldbe in same place
        this.messageBox.nativeElement.scrollTo(0, this.messageBox.nativeElement.scrollHeight - height);
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
    } else if (this.selectedGroup.phase === 'archive') {
      return;
    } else {
      // make typing emite true so that user can send the next message and emit event immediately
      // this.typingEvent = true;
      // let notify: any;
      // if(this.messages.length > 0){
      //  notify = moment(this.messages[this.messages.length - 1].createdTime).add(1, 'h') < moment(value.createdTime);
      // }
      // && (this.messages.length = 0 || notify)
      if (this.selectedGroup.phase === 'botInactive') {
        console.log('Trigerred notify message');
        this.socketService.sendNotifyMessage(value, this.selectedGroup);
      } else {
        console.log('sending message');
        this.socketService.sendMessage(value, this.selectedGroup);
      }
    }
    this.textArea.nativeElement.addEventListener('keypress', (e: any) => {
      const key = e.which || e.keyCode;
      if (key === 13) { // 13 is enter
        e.preventDefault();
      }
    });
    this.message.reset();
  }

  receiveMessageFromSocket() {
    this.socketService.receiveMessages()
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((msg: any) => {
        if (msg.receiverId === this.selectedGroup.id) {
          this.messages.push(msg);
          // making the alert message null immediately after receiving message from socket
          this.alertMessage = null;
          this.alert = false;
          this.ref.detectChanges();
          this.scrollToBottom();
          console.log(msg);
          if (msg.senderId !== this.selectedUser.id) {
            console.log('emit message read');
            this.socketService.emitMessageRead(this.selectedGroup.id, this.selectedUser.id);
          }
        } else if (msg.senderId !== this.selectedUser.id) {
          this.unreadMessageCount++;
          this.activeGroups.map((group: any) => {
            if (group.id === msg.receiverId) {
              group.unreadCount++;
              this.ref.markForCheck();
            }
          });
          this.inactiveGroups.map((group: any) => {
            if (group.id === msg.receiverId) {
              group.unreadCount++;
              this.ref.markForCheck();
            }
          });
          // if(msg.senderId !== this.selectedUser.id) {
          //   console.log('emitting sync count');
          //   this.socketService.emitCountSync(this.selectedUser.id,this.unreadMessageCount);
          // }
     }
        if (msg.senderId !== this.selectedUser.id && this.unreadMessageCount > 0) {
          const favicon: any = document.querySelector('head link');
          favicon.href = 'assets/favicon/favicon.png';
          document.querySelector('title').innerText = `(${this.unreadMessageCount}) ` + 'Messages';
          this.sharedService.playsound();
          this.sharedService.createWebNotification('New Message from ' + msg.senderName, msg.text);
        }
      });
  }

  resetMessage(id: any) {
    // this below step is to hide prescrition component on group change or group icon click
    this.showPrescriptionComponent = false;
  }

  receiveUpdatedMessageFromSocket() {
    this.socketService.receiveUpdatedMessage()
    .pipe(takeUntil(this.unsubscribeObservables))
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
    .pipe(takeUntil(this.unsubscribeObservables))
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

  // getDoctors
  getDoctors() {
    if (this.doctorList) {
      this.chatService.getDoctors(this.userId)
      .pipe(takeUntil(this.unsubscribeObservables))
        .subscribe((doctors) => {
          doctors.map((doctor: any) => {
            this.doctors.push(doctor);
            if (doctor.picUrl) {
              this.chatService.downloadFile(doctor.picUrl)
              .pipe(takeUntil(this.unsubscribeObservables))
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

  // Doctor modal window open method
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
    .pipe(takeUntil(this.unsubscribeObservables))
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
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((notify: any) => {
        this.alertMessage = notify.message;
      });
  }

  /**
   * for getting all the media messages
   */
  media() {
    const x = window.matchMedia('(min-width: 769px)');
    if (x.matches) {
      this.rightSidebar.nativeElement.style.display = 'block';
      this.chat.nativeElement.style.width = 'calc(100% - 266px)';
      this.ref.detectChanges();
    } else {
      this.rightSidebar.nativeElement.style.display = 'block';
      this.chat.nativeElement.style.width = '100%';
      this.ref.detectChanges();
    }
    const size = 5;
    this.mediaMessages = [];
    this.gettingMessages = true;
    console.log('made true');
    this.ref.markForCheck();
    this.chatService.media(this.selectedGroup.id, this.mediaPage, size)
      .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe(result => {
        this.gettingMessages = false;
        this.ref.markForCheck();
        result.map((message: any) => {
          this.mediaMessages.push(message);
          this.ref.detectChanges();
        });
      });
  }

  // for all file section to be real time
  socketMedia() {
    this.socketService.mediaReceive()
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((result) => {
        console.log('result: ' + JSON.stringify(result));
        result.map((message: any) => {
          this.mediaMessages.push(message);
          this.ref.detectChanges();
        });
      });
  }
  /**
   *
   * Close the right sidebar on click of close button and resize the chat window to 100% width
   * @//memberof ChatComponent
   */
  w3_close() {
    this.rightSidebar.nativeElement.style.display = 'none';
    this.chat.nativeElement.style.width = '100%';
  }

  getMoreMedia() {
    const size = 5;
    this.chatService.media(this.selectedGroup.id, this.mediaPage, size)
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe(result => {
        result.map((message: any) => {
          this.mediaMessages.push(message);
        });
      });
  }

  // call get more media messages to get next page of media messages
  scroll() {
    const scrollPane = this.rightSidebar.nativeElement;
    if (scrollPane.scrollTop === 0) {
      this.mediaPage = this.mediaPage + 1;
      this.getMoreMedia();
    }
  }

  receivedGroupStatus() {
    this.socketService.receivedGroupStatus()
    .pipe(takeUntil(this.unsubscribeObservables))
      .subscribe((groupUpdate => {
        this.groups.map((group: any) => {
          if (groupUpdate.groupId === group.id) {
            group.status = groupUpdate.groupStatus;
          }
          this.ref.markForCheck();
        });
      }));
  }
  // work under progress
  endConsultation() {
    // let groupId = this.chatService.getGroup().id;
    if (!this.selectedGroup.prescription_generated) {
    const doctorConfirmation = window.confirm('Are you sure you want to leave without generating prescription?');
    if (!doctorConfirmation) {
        return;
    }
  }
    this.socketService.endConsultation(this.selectedUser, this.selectedGroup);
    // window.localStorage.removeItem('prescriptionGenerated'+groupId);
    // if (this.selectedUser.role === 'doctor') {
    //   // this.groups.splice(1, 1);
    //   // this.selectedGroup = this.groups[0];
    //   // this.getMessage(this.selectedGroup);
    //   // this.ref.detectChanges();
    // } else {
    //   return;
    // }
  }

  // consultationStatus() {
  //   this.socketService.receiveEndConsultation()
  //   .takeUntil(this.unsubscribeObservables)
  //     .subscribe((response) => {
  //       this.alert = true;
  //       this.alertMessage = response.message;
  //     });
  // }
}
