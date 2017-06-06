import { Component, ViewChild } from '@angular/core';
import { DoctorsListService } from '../doctorsList/doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveChatService } from './live-chat.service';
import { Message } from '../shared/database/message';

/**
 * This class represents the lazy loaded ModalComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-doctor-live',
    templateUrl: 'doctor-live.component.html',
    styleUrls: ['doctor-live.component.css'],
})
export class DoctorLiveComponent {

    selectedDoctor: DoctorDetails;
    safeUrl: any;
    messages: Message[];
    sentTime: any;

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
        let type = '';
        let contentType = 'text';
        this.sentTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(message, this.sentTime, type, contentType)
            .then(message => {
        this.messages.push(message);
        this.scrollToBottom();
      });
    }

    addReplyMessages(message: string): void {
        if (!message) { return; }
        let time = new Date();
        let type = 'in';
        let contentType = 'text';
        this.sentTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(message, this.sentTime, type, contentType)
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

    createRadio() {
        let message = '';
        let type = 'in';
        let contentType = 'radio';
        let time = new Date();
        this.sentTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(message, this.sentTime, type, contentType)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }

    createSlider() {
        let message = '';
        let type = 'in';
        let contentType = 'slider';
        let time = new Date();
        this.sentTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(message, this.sentTime, type, contentType)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }

    createCheckbox() {
        let message = '';
        let type = 'in';
        let contentType = 'checkbox';
        let time = new Date();
        this.sentTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createMessages(message, this.sentTime, type, contentType)
        .then(message => {
            this.messages.push(message);
            this.scrollToBottom();
        });
    }
}
