import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { SecurityService } from '../shared/services/security.service';
import { UserDetails } from '../shared/database/user-details';
import { ChatService } from '../chat/chat.service';
import { ProfileService } from './profile.service';
import { DoctorMedia } from '../shared/database/doctor-media';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * This class represents the lazy loaded RegisterComponent.
 */
@Component({
    selector: 'app-profile',
    templateUrl: 'profile.component.html',
    styleUrls: ['profile.component.css'],
})
export class ProfileComponent implements OnInit, OnDestroy {

    @ViewChild(NavbarComponent) navbarComponent: NavbarComponent;
    @ViewChild('videoPlayer') videoPlayer: ElementRef;
    item: DoctorMedia = {
        id: null,
        title: null,
        description: null,
        url: null,
        thumbUrl: null,
        userId: null,
        type: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null
    };
    user: UserDetails;
    url: string;
    thumbImage: File;
    mediaFiles: DoctorMedia[] = [{
        id: null,
        title: null,
        description: null,
        url: null,
        thumbUrl: null,
        userId: null,
        type: null,
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null
    }];
    doctorMedia: DoctorMedia = {
        id: null,
        title: '',
        description: '',
        url: '',
        thumbUrl: '',
        userId: null,
        type: '',
        createdBy: null,
        updatedBy: null,
        createdAt: null,
        updatedAt: null
    };
    private unsubscribeObservables = new Subject();

    constructor(
        private securityService: SecurityService,
        private chatService: ChatService,
        private profileService: ProfileService,
        private ref: ChangeDetectorRef,
        private router: Router
    ) { }

    ngOnInit() {
        const cookie = this.securityService.getCookie('userDetails');
        console.log(cookie);
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
        // this.navbarComponent.navbarColor(0, '#6960FF');
        if (this.user.role === 'doctor') {
            this.getDoctorMedia();
        }
    }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
    }

    saveImage(files: FileList) {
        this.chatService.uploadFile(files[0])
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe(res => {
                this.user.picUrl = res._body;
                this.securityService.setCookie('userDetails', JSON.stringify(this.user), 1);
                this.downloadProfileImage(res._body);
                this.profileService.updateUserDetails(this.user)
                    .pipe(takeUntil(this.unsubscribeObservables))
                    .subscribe((res1: any) => {
                        return;
                    });
            });
    }

    downloadProfileImage(fileName: string) {
        this.chatService.downloadFile(fileName)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res) => {
                res.onloadend = () => {
                    this.url = res.result;
                    this.navbarComponent.picUrl = res.result;
                    this.ref.detectChanges();
                };
            });
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
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.url = res.result;
                    this.ref.detectChanges();
                };
            });
    }

    getDoctorMedia() {
        this.profileService.getDoctorMedia(this.user.id)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                this.mediaFiles = res;
                this.mediaFiles.map((mediaFile: any, i: number) => {
                    this.chatService.downloadFile(mediaFile.thumbUrl)
                        .pipe(takeUntil(this.unsubscribeObservables))
                        .subscribe(res1 => {
                            res1.onloadend = () => {
                                this.mediaFiles[i].thumbUrl = res1.result;
                            };
                        });
                });
            });
    }

    uploadMedia(files: FileList) {
        const self = this;
        const fileReader: FileReader = new FileReader();
        if (files[0].type.match('image')) {
            this.chatService.uploadFile(files[0])
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    this.doctorMedia.url = res._body; // setting url of media file
                    this.chatService.uploadThumbnail(files[0])
                        .pipe(takeUntil(this.unsubscribeObservables))
                    .subscribe(res1 => {
                            this.doctorMedia.thumbUrl = res1._body; // setting thumbUrl of media file
                            this.updateMedia('image', files[0]);
                        });
                });
        } else if (files[0].type.match('video')) {
            this.chatService.uploadFile(files[0])
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    this.doctorMedia.url = res._body;
                    fileReader.onload = () => {
                        const blob = new Blob([fileReader.result], { type: files[0].type });
                        const url = URL.createObjectURL(blob);
                        const video = document.createElement('video');
                        const timeupdate = () => {
                            if (self.createThumb(video, url, files[0])) {
                                video.removeEventListener('timeupdate', timeupdate);
                                video.pause();
                            }
                        };
                        video.addEventListener('loadeddata', () => {
                            if (self.createThumb(video, url, files[0])) {
                                video.removeEventListener('timeupdate', timeupdate);
                            }
                        });
                        video.addEventListener('timeupdate', timeupdate);
                        video.preload = 'metadata';
                        video.src = url;
                    };
                    fileReader.readAsArrayBuffer(files[0]);
                    fileReader.onerror = (error) => {
                        console.log('Error: ', error);
                    };
                });
        } else if (files[0].type.match('application')) {
            this.chatService.uploadFile(files[0])
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    // this.updateMedia('doc', res._body);
                });
        } else {
            return;
        }
    }

    /**
     * creates an image for the provided video
     * returns success if image is created else returns false
     * @//param {*} video
     * @//param {string} url
     * @//param {string} name
     * @//returns
     * @//memberof ProfileComponent
     */
    createThumb(video: any, url: string, file: File) {
        const canvas = document.createElement('canvas');
        canvas.width = 150;
        canvas.height = 150;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const image = canvas.toDataURL();
        const success = image.length > 100;
        if (success) {
            this.thumbImage = this.dataURLtoFile(image, 'thumbnail_' + file.name);
            this.chatService.uploadFile(this.thumbImage)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    this.doctorMedia.thumbUrl = res._body;
                    this.updateMedia('video', file);
                });
            URL.revokeObjectURL(url);
        }
        return success;
    }

    /**
     * converts base64 url string into image file
     * returns image file
     * @//param {*} dataurl
     * @//param {*} filename
     * @//returns
     * @//memberof ProfileComponent
     */
    dataURLtoFile(dataurl: any, filename: any) {
        const arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    updateMedia(type: string, file: File) {
        const str = file.name;
        const fileName = str.split('.');
        this.doctorMedia.userId = this.user.id;
        this.doctorMedia.title = fileName[0];
        this.doctorMedia.description = 'description';
        this.doctorMedia.type = type;
        this.doctorMedia.createdBy = this.user.id;
        this.doctorMedia.updatedBy = this.user.id;
        this.profileService.createDoctorMedia(this.doctorMedia)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                this.mediaFiles.push(res);
                this.chatService.downloadFile(res.thumbUrl)
                    .pipe(takeUntil(this.unsubscribeObservables))
                    .subscribe(res1 => {
                        res1.onloadend = () => {
                            const length = this.mediaFiles.length;
                            this.mediaFiles[length - 1].thumbUrl = res1.result;
                        };
                    });
            });
    }

    deleteMedia(i: number, file: any) {
        this.profileService.deleteDoctorMedia(file.id)
            .pipe(takeUntil(this.unsubscribeObservables))
            .subscribe((res: any) => {
                this.mediaFiles.splice(i, 1);
            });
    }

    openModal(file: DoctorMedia) {
        if (file.type === 'image' || file.type === 'video') {
            this.chatService.downloadFile(file.url)
                .pipe(takeUntil(this.unsubscribeObservables))
                .subscribe(res => {
                    res.onloadend = () => {
                        this.item.type = file.type;
                        this.item.url = res.result;
                    };
                });
        } else {
            return;
        }
    }

    stopVideo(item: any) {
        if (item.type === 'video') {
            this.videoPlayer.nativeElement.pause();
        } else {
            return;
        }
    }
}
