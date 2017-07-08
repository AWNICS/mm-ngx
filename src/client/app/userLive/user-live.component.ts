import { Component, ViewChild, Output, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorsListService } from '../doctorsList/doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';
import { LiveChatService } from '../doctorLive/live-chat.service';
import { UserDetails } from '../shared/database/userDetails';
import { Message } from '../shared/database/message';

/**
 * DoctorLive component for consultation
 * @export
 * @class DoctorLiveComponent
 */
@Component({
    moduleId: module.id,
    selector: 'mm-user-live',
    templateUrl: 'user-live.component.html',
    styleUrls: ['user-live.component.css']
})
export class UserLiveComponent implements OnInit {

    @Output() message:string;
    @Output() safeUrl: any;
    @ViewChild('userLive') userLive: UserLiveComponent;
    selectedDoctor: DoctorDetails;
    messages: Message[];
    userDetails: UserDetails;
    newMessage: Message = {
        user: '',
        id: null,
        text: '',
        picUrl: '',
        lastUpdateTime: '',
        type: '',
        status: '',
        contentType: 'text',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        }
    };
    radioMessage: Message = {
        user: 'Rahul',
        id: null,
        text: 'Kindly choose an option: ',
        picUrl: '',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'radio',
        contentData: {
          data: ['Yes','No','Not sure']
        },
        responseData: {
          data: ['']
        }
    };
    sliderMessage: Message = {
        user: 'Rahul',
        id: null,
        text: 'Kindly choose a number from 0 to 10: ',
        picUrl: '',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'slider',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        }
    };
    checkboxMessage: Message = {
        user: 'Rahul',
        id: null,
        text: 'Kindly check the relevent boxes: ',
        picUrl: '',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'checkbox',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        }
    };
    imageMessage: Message = {
        user: 'Rahul',
        id: null,
        text: 'Image Component',
        picUrl: '',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'image',
        contentData: {
          data: ['http://photo.sf.co.ua/g/501/1.jpg']
        },
        responseData: {
          data: ['']
        }
    };
    videoMessage: Message = {
        user: 'Rahul',
        id: null,
        text: 'Video Component',
        picUrl: '',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'video',
        contentData: {
          data: ['assets/videos/movie.mp4']
        },
        responseData: {
          data: ['']
        }
    };

    appearMessage: Message = {
        user: 'Rahul',
        id: null,
        text: 'Appear Component',
        picUrl: '',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'appear',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        }
    };

    constructor(
        private doctorsListService: DoctorsListService,
        private domSanitizer: DomSanitizer,
        private liveChatService: LiveChatService
        ) {
     }

     ngOnInit() {
         this.selectedDoctor = this.doctorsListService.getSelectedDoctor();
         this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.selectedDoctor.appearUrl);
         this.getMessages();
         this.getUserDetail();
     }

     addNewEntry(event:any) {
         this.addReplyMessages(event.value);
         console.log(event);
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

     getUserDetail() {
         this.liveChatService.getUsers()
         .then(userDetails => {
             this.userDetails = userDetails;
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
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
        this.scrollToBottom();
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
        this.newMessage.type = '';
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
        this.scrollToBottom();
      });
    }

    /**
     * create radio message using RadioMessageComponent
     * @memberof DoctorLiveComponent
     */
    createRadio() {
        let time = new Date();
        this.radioMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.radioMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.radioMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }

    /**
     * create slider message using SliderMessageComponent
     * @memberof DoctorLiveComponent
     */
    createSlider() {
        let time = new Date();
        this.sliderMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.sliderMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.sliderMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }

    /**
     * create checkbox message using CheckboxMessageComponent
     * @memberof DoctorLiveComponent
     */
    createCheckbox() {
        let time = new Date();
        this.checkboxMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.checkboxMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.checkboxMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }


    /**
     * create image message using ImageMessageComponent
     * @memberof DoctorLiveComponent
     */
    createImage() {
        let time = new Date();
        this.imageMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.imageMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.imageMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            //this.liveChatService.setImageMessage(this.imageMessage);
        });
    }

    /**
     * create video message using VideoMessageComponent
     * @memberof DoctorLiveComponent
     */
    createVideo() {
        let time = new Date();
        this.videoMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.videoMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.videoMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            //this.liveChatService.setVideoMessage(this.videoMessage);
        });
    }

    createAppear() {
        let time = new Date();
        this.appearMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.appearMessage.picUrl = this.selectedDoctor.picUrl;
        this.liveChatService.createMessages(this.appearMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }

    /**
     * Function to scroll the focus to the last line in the chatBody
     * @memberof DoctorLiveComponent
     */
    scrollToBottom() {
        let chatBody = document.getElementById('chatBody');
        let height = chatBody.scrollHeight;
        chatBody.scrollTop = height;
    }
}
