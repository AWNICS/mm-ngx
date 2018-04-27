import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from '../chat/chat.service';
import { ProfileService } from './profile.service';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    moduleId: module.id,
    selector: 'mm-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class ProfileComponent implements OnInit {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    user: UserDetails;
    url: string;

    constructor(
        private securityService: SecurityService,
        private chatService: ChatService,
        private profileService: ProfileService,
        private ref: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit() {
        let cookie = this.securityService.getCookie('userDetails');
        this.user = JSON.parse(cookie);
        if (this.user || cookie !== '') {
            if (this.user.picUrl) {
                this.downloadProfileImage(this.user.picUrl);
            } else {
                this.downloadAltPic(this.user.role);
            }
        } else {
            this.router.navigate([`/login`]);
        }
        this.navbarComponent.navbarColor(0, '#6960FF');
    }

    saveImage(files: FileList) {
        this.chatService.uploadFile(files)
            .subscribe(res => {
                this.user.picUrl = res._body;
                this.downloadProfileImage(res._body);
                this.profileService.updateUserDetails(this.user)
                .subscribe(res => {
                    console.log(res);
                });
            });
    }

    downloadProfileImage(fileName: string) {
        this.chatService.downloadFile(fileName)
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = res.result;
                };
            });
        this.ref.detectChanges();
    }

    downloadAltPic(role: string) {
        let fileName: string;
        if (role === 'bot') {
            fileName = 'bot.jpg';
        } else if (role === 'doctor') {
            fileName = 'doc.png';
        } else {
            fileName = 'user.png';
        }
        this.chatService.downloadFile(fileName)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.url = res.result;
                    this.ref.detectChanges();
                };
            });
    }
}
