import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from '../chat/chat.service';

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
    userDetails: FormGroup;
    user: UserDetails;
    url: string;

    constructor(
        private fb: FormBuilder,
        private securityService: SecurityService,
        private chatService: ChatService,
        private ref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        let cookie = this.securityService.getCookie('userDetails');
        this.user = JSON.parse(cookie);
        if (this.user || cookie !== '') {
            this.userDetails = this.fb.group({
                firstname: [this.user.firstname, Validators.required],
                lastname: [this.user.lastname, Validators.required],
                email: [{value: this.user.email, disabled: true}, Validators.required],
                password: [{ value: this.user.password, disabled: true }],
                phoneNo: [{value: this.user.phoneNo, disabled: true}, Validators.required],
                picUrl: [this.user.picUrl],
                sex: '',
                height: null,
                weight: null,
                bloodGroup: '',
                allergies: '',
                location: '',
                address: '',
                staffId: '',
                speciality: '',
                regNo: '',
                experience: '',
                description: ''
            });
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

    update({ value, valid }: { value: UserDetails, valid: boolean }) {
        console.log('value ', value);
    }

    saveImage(files: FileList) {
        this.chatService.uploadFile(files)
            .subscribe(res => {
                this.userDetails.value.picUrl = res._body;
                this.downloadProfileImage(res._body);
            })
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
