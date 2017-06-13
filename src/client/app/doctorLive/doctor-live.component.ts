import { Component, ViewChild, Output } from '@angular/core';
import { DoctorsListService } from '../doctorsList/doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveChatService } from './live-chat.service';
import { Message } from '../shared/database/message';

/**
 * This class represents the lazy loaded DoctorLiveComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-live',
    templateUrl: 'doctor-live.component.html',
    styleUrls: ['doctor-live.component.css']
})
export class DoctorLiveComponent {

    @Output() message:string;
    selectedDoctor: DoctorDetails;
    safeUrl: any;
    messages: Message[];
    newMessage: Message = {
        user: '',
        id: null,
        text: '',
        picUrl: '',
        lastUpdateTime: '',
        type: '',
        status: '',
        contentType: '',
        contentData: {
          data: ['']
        },
        responseData: {
          data: ['']
        }
    };
    newQuestion: Message = {
        user: 'Rahul',
        id: null,
        text: 'Can you call me?',
        picUrl: 'assets/jpg/rahul.jpg',
        lastUpdateTime: '',
        type: 'in',
        status: 'sending',
        contentType: 'radio',
        contentData: {
          data: ['Yes','No','I will see']
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
        this.selectedDoctor = this.doctorsListService.getSelectedDoctor();
        this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.selectedDoctor.appearUrl);
        this.getMessages();
     }

     getMessages() {
         this.liveChatService.getMessages()
         .then(messages => {
             this.messages = messages;
         });
     }

     addMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        this.newMessage.text= message;
        this.newMessage.picUrl = 'assets/png/male1.png';
        this.newMessage.type = 'in';
        this.newMessage.contentType = 'text';
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
        this.scrollToBottom();
        //console.log('This is from chat live component: ' + JSON.stringify(this.messages));
      });
    }

    addReplyMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        this.newMessage.text= message;
        this.newMessage.picUrl = 'assets/png/female3.png';
        this.newMessage.type = '';
        this.newMessage.contentType = 'text';
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
            .then(message => {
        this.messages.push(message);
        this.scrollToBottom();
      });
    }

    createRadio() {
        this.newMessage.contentData.data = ['Yes', 'No', 'Not sure'];
        this.newMessage.type = 'in';
        this.newMessage.contentType = 'radio';
        let time = new Date();
        this.newQuestion.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newQuestion)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            this.liveChatService.setMessage(message);
        });
    }

    createSlider() {
        this.newMessage.type = 'in';
        this.newMessage.contentType = 'slider';
        let time = new Date();
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            this.liveChatService.setMessage(message);
            // console.log('from create slider: ' + JSON.stringify(message)); for debugging purpose only
        });
    }

    createCheckbox() {
        this.newMessage.type = 'in';
        this.newMessage.contentType = 'checkbox';
        let time = new Date();
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            this.liveChatService.setMessage(message);
        });
    }

    createImage() {
        this.newMessage.type = 'in';
        this.newMessage.contentData.data = [
            'http://photo.sf.co.ua/g/501/1.jpg',
            'https://cdn.pixabay.com/photo/2017/01/06/19/15/soap-bubble-1958650_960_720.jpg',
            'http://www.gettyimages.co.uk/gi-resources/images/Embed/new/embed2.jpg',
            'http://www.laughspark.info/uploadfiles/funny-sqiuurel-talking-imags-i-5922.jpg',
            'http://demo.elmanawy.info/moraco/layout1/assets/images/portfolio/12.jpg',
            'http://pbs.twimg.com/media/CnSRWE0UMAALxwk.jpg:orig'
        ];
        this.newMessage.contentType = 'image';
        let time = new Date();
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            this.liveChatService.setMessage(message);
        });
    }

    createVideo() {
        this.newMessage.type = 'in';
        this.newMessage.contentData.data = ['assets/videos/movie.mp4'];
        this.newMessage.contentType = 'video';
        let time = new Date();
        this.newMessage.lastUpdateTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(this.newMessage)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
            this.liveChatService.setMessage(message);
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
