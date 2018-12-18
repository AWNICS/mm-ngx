import { Component, OnInit, ChangeDetectorRef, AfterViewInit, AfterViewChecked, ViewChild, ElementRef,
     OnChanges,OnDestroy, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../../chat/socket.service';
import { SecurityService } from '../services/security.service';
import { ChatService } from '../../chat/chat.service';
import { UserDetails } from '../database/user-details';
import { SharedService } from '../services/shared.service';
import { Notification } from '../database/notification';
import { Subject } from 'rxjs/Subject';

@Component({
    moduleId: module.id,
    selector: 'mm-navbar',
    templateUrl: 'navbar.component.html',
    styleUrls: ['navbar.component.css']
})

export class NavbarComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
    loggedIn: boolean = false;
    user: UserDetails;
    picUrl: string;
    notifications: Notification[] = [];
    notify = false;
    @ViewChild('navbar') navbar: ElementRef;
    @ViewChild('bell') bell: ElementRef;
    unreadNotifications:number=0;
    unreadMessageCount:number;
    @Input() set unreadCount(count:number) {
        this.unreadMessageCount = count;
    }
    private unsubscribeObservables:any = new Subject();

    constructor(
        private ref: ChangeDetectorRef,
        private socketService: SocketService,
        private securityService: SecurityService,
        private sharedService: SharedService,
        private chatService: ChatService,
        private router: Router) {
    }

    ngOnInit() {
        this.loggedIn = this.securityService.getLoginStatus();
        if (this.loggedIn === true) {
            this.user = JSON.parse(this.securityService.getCookie('userDetails'));
            if (this.user) {
                this.getNotifications(this.user);
                this.getLatestNotification();
                let initialLoad = this.sharedService.getNavbarLoad();
                this.receiveMessageFromSocket();
                // if(this.router.url.match(/chat/)) {
                    // console.log(this.unreadCount);
                    // this.unreadMessageCount = this.unreadCount;
                // } else {
                if(initialLoad) {
                    this.getUnreadMessages();
                } else {
                    this.unreadMessageCount = this.sharedService.getUnreadCount();
                }
            // }
                if(this.user.role==='doctor') {
                    this.consultationStatus();
                }
                if (this.user.picUrl) {
                    this.downloadPic(this.user.picUrl);
                } else {
                    this.downloadAltPic(this.user.role);
                }
            }
        }
    }

    ngAfterViewInit() {
        this.checkWindowVisibility();
        window.addEventListener('unload',()=> {
            window.localStorage.setItem('pageReloaded','true');
        });
    }

    ngAfterViewChecked() {
        this.loggedIn = this.securityService.getLoginStatus();
    }

    // ngOnChanges() {
    //     console.log(this.unreadCount);
    // }

    ngOnDestroy() {
        this.unsubscribeObservables.next();
        this.unsubscribeObservables.complete();
        this.sharedService.setUnreadCount(this.unreadMessageCount);
    }

  receiveMessageFromSocket() {
    this.socketService.receiveMessages()
    .takeUntil(this.unsubscribeObservables)
      .subscribe((msg: any) => {
        if (msg.senderId !== this.user.id && !this.router.url.match(/chat/)) {
            this.unreadMessageCount++;
        }
      });
  }

    getUnreadMessages() {
        this.chatService.getGroups(this.user.id)
        .takeUntil(this.unsubscribeObservables)
          .subscribe((groups) => {
              groups.activeGroups.map((activeGroup:any) => {
                this.unreadMessageCount =+ activeGroup.unreadCount;
              });
              groups.inactiveGroups.map((inactiveGroup:any) => {
                this.unreadMessageCount =+ inactiveGroup.unreadCount;
              });
              this.sharedService.setUnreadCount(this.unreadMessageCount);
              console.log(this.unreadMessageCount);
          });
    }

    checkWindowVisibility() {
        window.addEventListener('focus',()=> {
            this.sharedService.setWindowVisibility(false);
        });
        window.addEventListener('blur',()=> {
            this.sharedService.setWindowVisibility(true);
        });
    }

    downloadPic(filename: string) {
        this.chatService.downloadFile(filename)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.markForCheck();
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
        .takeUntil(this.unsubscribeObservables)
            .subscribe((res: any) => {
                res.onloadend = () => {
                    this.picUrl = res.result;
                    this.ref.markForCheck();
                };
            });
    }

    logout() {
        this.securityService.setLoginStatus(false);
        this.socketService.logout(this.user.id);
        this.securityService.deleteCookie('userDetails');
        this.securityService.deleteCookie('token');
        this.socketService.setSocketStatus(false);
        this.sharedService.setNavbarLoad(true);
        console.log('Made socketConnected as false');
    }

    navbarColor(number: number, color: string) {
        if (number > 800) {
            this.navbar.nativeElement.style.backgroundColor = color;
        } else {
            this.navbar.nativeElement.style.backgroundColor = color;
        }
    }

    getNotifications(user: UserDetails) {
        let page = 1;
        let size = 10;
        this.sharedService.getNotificationsByUserId(user.id, page, size)
        .takeUntil(this.unsubscribeObservables)
            .subscribe((notifications) => {
                console.log('Notifications received all');
                console.log(notifications);
                if (notifications.length >= 1) {
                    this.notify = true;
                    //reverse to show the items from latest to last later will have to change the logic in db itself
                    this.notifications = notifications;
                    notifications.map((notification:any)=> {
                        if(notification.status!=='read') {
                            this.unreadNotifications++;
                        }
                    });
                    this.ref.detectChanges();
                }
            });
    }

    startConsultation(notification: Notification) {
        if(notification.status==='created') {
            this.unreadNotifications--;
        }
        this.socketService.userAdded(this.user, notification);
        this.bell.nativeElement.classList.remove('animated');
    }

    getLatestNotification() {
        this.socketService.consultNotification()
        .takeUntil(this.unsubscribeObservables)
            .subscribe((data) => {
                if (data) {
                    //unshift to add the item to start of array
                    this.notifications.unshift(data.notification);
                    this.unreadNotifications++;
                    this.notify = true;
                    this.bell.nativeElement.classList.add('animated');
                    this.sharedService.playsound();
                    this.ref.markForCheck();
                }
            });
    }

    consultationStatus() {
        this.socketService.receiveUserAdded()
        .takeUntil(this.unsubscribeObservables)
            .subscribe((response) => {
                console.log('Received user added in navbar');
                this.sharedService.doctorAddedToGroup(response);
                response.group.phase='active';
                this.sharedService.setGroup(response.group);
                // this.getNotifications(this.user);
                ///thisis to reload the page if it is chat component
                if(this.router.url.match(/chat/)) {
                    this.router.navigateByUrl('/', {skipLocationChange: true}).then((a)=> {
                        this.router.navigate([`/chat/${response.doctorId}`]);
                });
                } else {
                    this.router.navigate([`/chat/${response.doctorId}`]);
                }
            });
    }
}
