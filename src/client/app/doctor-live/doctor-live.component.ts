import { Component, ViewChild, Output, OnInit, AfterViewChecked } from '@angular/core';
import { DoctorsListService } from '../doctors-list/doctors-list.service';
import { DoctorDetails } from '../shared/database/doctor-details';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveChatService } from './live-chat.service';
import { Message } from '../shared/database/message';
import { UserDetails } from '../shared/database/user-details';

/**
 * DoctorLive component for consultation
 * @export
 * @class DoctorLiveComponent
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-live',
    templateUrl: 'doctor-live.component.html',
    styleUrls: ['doctor-live.component.css']
})
export class DoctorLiveComponent implements OnInit, AfterViewChecked {

    @Output() message:string;
    @Output() safeUrl: any;
    @ViewChild('doctorLive') doctorLive: DoctorLiveComponent;
    initialTime:any;
    selectedDoctor: DoctorDetails;
    messages: Message[];
    userDetails: UserDetails;
    newMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: '',
        picUrl: '',
        type: '',
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
        createdTime: '',
        updatedTime: ''
    };

    radioMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Kindly choose an option: ',
        picUrl: '',
        type: 'in',
        status: 'sending',
        contentType: 'radio',
        contentData: {
          data: ['Yes']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };
    sliderMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Kindly choose a number from 0 to 10: ',
        picUrl: '',
        type: 'in',
        status: 'sending',
        contentType: 'slider',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };

    checkboxMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Kindly check the relevent boxes: ',
        picUrl: '',
        type: 'in',
        status: 'sending',
        contentType: 'checkbox',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };
    imageMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Image Component',
        picUrl: '',
        type: 'in',
        status: 'sending',
        contentType: 'image',
        contentData: {
          data: ['http://photo.sf.co.ua/g/501/1.jpg']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };
    videoMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Video Component',
        picUrl: '',
        type: 'in',
        status: 'sending',
        contentType: 'video',
        contentData: {
          data: ['assets/videos/movie.mp4']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };

    appearMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Appear Component',
        picUrl: '',
        type: 'in',
        status: 'sending',
        contentType: 'appear',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };

    alertMessage: Message = {
        _id: null,
        receiverId: null,
        receiverType: null,
        senderId: null,
        text: 'Alert message',
        picUrl: '',
        type: 'alert',
        status: 'sent',
        contentType: 'text',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        },
        createdBy: '',
        updatedBy: '',
        createdTime: '',
        updatedTime: ''
    };

    constructor(
        private doctorsListService: DoctorsListService,
        private domSanitizer: DomSanitizer,
        private liveChatService: LiveChatService
        ) {
     }

     ngOnInit() {
         this.initialTime = new Date().getHours() + ':' + new Date().getMinutes() ;
         this.selectedDoctor = this.doctorsListService.getSelectedDoctor();
         this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.selectedDoctor.appearUrl);
         this.getMessages();
         this.getUser();
         this.createAlertMessage('A patient is waiting for you.');
     }

     ngAfterViewChecked() {
         this.scrollToBottom();
     }

     addNewEntry(event:any) {
         this.addReplyMessages(event.value);
         //console.log(event); //for debugging purposes only
     }

     /**
      * get pre-stored messages
      * @memberof DoctorLiveComponent
      */
     getMessages() {
         this.liveChatService.getMessages()
         .then(messages => {
             this.messages = messages;
         });
     }

     getUser() {
         this.liveChatService.getUsers()
         .then(users => {
             this.userDetails = users;
         });
     }

     /**
      * adding new messages as text
      * @param {string} message
      * @returns {void}
      * @memberof DoctorLiveComponent
      */
     addMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        this.newMessage.text= message;
        this.newMessage.picUrl = this.selectedDoctor.picUrl;
        this.newMessage.type = 'in';
        this.newMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
      });
    }

    createAlertMessage(message: string): void {
        let time = new Date();
        this.alertMessage.text= message;
        this.alertMessage.picUrl = 'assets/jpg/chat_bot-02.jpg';
        this.alertMessage.type = 'doctorAlert';
        this.alertMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.alertMessage)
            .then(message => {
        this.messages.push(message);
      });
    }

    /**
     * add reply messages as text
     * @param {string} message
     * @returns {void}
     * @memberof DoctorLiveComponent
     */
    addReplyMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        this.newMessage.text= message;
        this.newMessage.picUrl = this.userDetails.picUrl;
        this.newMessage.type = 'out';
        this.newMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
      });
    }

    /**
     * create radio message using RadioMessageComponent
     * @memberof DoctorLiveComponent
     */
    createRadio() {
        let time = new Date();
        this.radioMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.radioMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.radioMessage)
        .then(message => {
            this.messages.push(message);
        });
    }

    /**
     * create slider message using SliderMessageComponent
     * @memberof DoctorLiveComponent
     */
    createSlider() {
        let time = new Date();
        this.sliderMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.sliderMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.sliderMessage)
        .then(message => {
            this.messages.push(message);
        });
    }

    /**
     * create checkbox message using CheckboxMessageComponent
     * @memberof DoctorLiveComponent
     */
    createCheckbox() {
        let time = new Date();
        this.checkboxMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.checkboxMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.checkboxMessage)
        .then(message => {
            this.messages.push(message);
        });
    }

    /**
     * create image message using ImageMessageComponent
     * @memberof DoctorLiveComponent
     */
    createImage() {
        let time = new Date();
        this.imageMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.imageMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.imageMessage)
        .then(message => {
            this.messages.push(message);
        });
    }

    /**
     * create video message using VideoMessageComponent
     * @memberof DoctorLiveComponent
     */
    createVideo() {
        let time = new Date();
        this.videoMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.videoMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.videoMessage)
        .then(message => {
            this.messages.push(message);
        });
    }

    createAppear() {
        let time = new Date();
        this.appearMessage.updatedTime = time.getHours() + ':' + time.getMinutes();
        this.appearMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.appearMessage)
        .then(message => {
            this.messages.push(message);
        });
    }

    /**
     * Function to scroll the focus to the last line in the chatBody
     * @memberof DoctorLiveComponent
     */
    scrollToBottom() {
        let height = document.getElementById('chatBody');
        height.scrollTop = height.scrollHeight;
    }
}
