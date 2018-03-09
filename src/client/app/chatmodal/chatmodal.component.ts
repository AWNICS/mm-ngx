import { Component, ViewChild, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { DoctorDetails } from '../shared/database/doctor-details';
import { ChatService } from '../chat/chat.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  moduleId: module.id,
  selector: 'mm-chat-modal',
  templateUrl: 'chatmodal.component.html',
  styleUrls: ['chatmodal.component.css']
})
export class ChatModalComponent {
  constructor(private modalService: NgbModal) { }

  open(content: any) {
    this.modalService.open(content);
  }
}
