import { Component, ViewChild } from '@angular/core';
import { DoctorsListService } from '../doctorsList/doctors-list.service';
import { DoctorDetails } from '../shared/database/doctorDetails';
import { DomSanitizer } from '@angular/platform-browser';
import { LiveChatService } from './live-chat.service';
import { SentMessage } from '../shared/database/sentMessage';
import { ReplyMessage } from '../shared/database/replyMessage';

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
    messages: any[];
    sentMessages: SentMessage[];
    replyMessages: ReplyMessage[];
    sentTime: any;
    replyTime: any;

    constructor(
        private doctorsListService: DoctorsListService,
        private domSanitizer: DomSanitizer,
        private liveChatService: LiveChatService
        ) {
        this.selectedDoctor = this.doctorsListService.getSelectedDoctor();
        this.safeUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.selectedDoctor.appearUrl);
        this.getSentMessages();
        this.getReplyMessages();
     }

     getSentMessages() {
         this.liveChatService.getSentMessages()
         .then(sentMessages => {
             this.sentMessages = sentMessages;
         });
         this.messages = this.sentMessages;
     }

     getReplyMessages() {
         this.liveChatService.getReplyMessages()
         .then(replyMessages => {
             this.replyMessages = replyMessages;
         });
         this.messages = this.replyMessages;
     }

     addSentMessages(sentMessage: string): void {
        if (!sentMessage) { return; }
        let time = new Date();
        this.sentTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createSentMessages(sentMessage, this.sentTime)
            .then(sentMessage => {
        this.sentMessages.push(sentMessage);
      });
    }

    addReplyMessages(replyMessage:string): void {
        if(!replyMessage) { return; }
        let time = new Date();
        this.replyTime = time.getHours() + ':' + time.getMinutes();
        this.liveChatService.createReplyMessages(replyMessage, this.replyTime)
        .then(replyMessage => {
            this.replyMessages.push(replyMessage);
        });
    }
}
