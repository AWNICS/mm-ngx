import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../chat/chat.service';
import { UserDetails } from '../database/user-details';
@Component({
    moduleId: module.id,
    selector: 'mm-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit {
    user: UserDetails;

    constructor(private chatService: ChatService) { }

    ngOnInit() {
    }
}
