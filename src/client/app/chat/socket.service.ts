import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Message } from '../shared/database/message';
import { SecurityService } from '../shared/services/security.service';
import { Group } from '../shared/database/group';
import { UserDetails } from '../shared/database/user-details';
import { Notification } from '../shared/database/notification';
import { NumberValueAccessor } from '@angular/forms/src/directives';

@Injectable()
export class SocketService {
    private socketConnected: Boolean = false;
    private socket: any;
    private baseUrl: string;

    constructor(
        private securityService: SecurityService
    ) {
        this.baseUrl = this.securityService.baseUrl;
    }

    /**
     * connection
     */
    connection(userId: number) {
        if(!this.socketConnected) {
            console.log('Socket not connected so making new connection');
            this.socketConnected = true;
            window.localStorage.setItem('pageReloaded','false');
            const token = this.securityService.getCookie('token');
            this.socket = io(`${this.baseUrl}`, {
            query: { token: token },
            secure: true
             });
            this.socket.on('connect', () => {
                this.socket.emit('user-connected', userId);
            });
        } else {
            console.log('Socket connection already exists');
        }
    }

    getSocketId() {
        return this.socket.id;
    }

    setSocketStatus(status:Boolean) {
        this.socketConnected = status;
    }

    receivedGroupStatus(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('received-group-status', (groupUpdate:any) => {
                observer.next(groupUpdate);
            });
        });
        return observable;
    }

    sendMessage(message: Message, group: Group) {
        this.socket.emit('send-message', message, group);
    }
    sendNotifyMessage(message: Message, group: Group) {
        this.socket.emit('send-message', message, group, 1);
    }

    receiveMessages(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-message', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    updateMessage(message: Message, index:number): void {
        this.socket.emit('update-message', {message: message, index: index});
    }

    receiveUpdatedMessage(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('updated-message', (res:any) => {
                observer.next(res);
            });
        });
        return observable;
    }

    delete(message: Message, index: number) {
        this.socket.emit('delete-message', message, index);
    }

    receiveDeletedMessage(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('deleted-message', (object: any) => {
                observer.next(object);
            });
        });
        return observable;
    }

    notifyUsers(message: Message): void {
        this.socket.emit('notify-users', message);
    }

    emitConsultNow(user:any, doctorId:number, doctorName:string, speciality:string) {
        this.socket.emit('consult-now', user, doctorId, doctorName, speciality);
    }

    emitMessageRead(groupId:number,userId:number) {
        this.socket.emit('message-read', groupId, userId);
    }

    receiveMessageread() {
        const observable = new Observable(observer => {
            this.socket.on('receive-message-read', (groupId:number) => {
                observer.next(groupId);
            });
        });
        return observable;
    }

    receiveConsultNow() {
        const observable = new Observable(observer => {
            this.socket.on('receive-consult-now', (link:any) => {
                observer.next(link);
            });
        });
        return observable;
    }

    doctorStatusUpdate(doctorId:any , status:any) {
        this.socket.emit('doctor-status', doctorId, status);
    }

    receiveDoctorStatus(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('received-doctor-status', (status: any) => {
                observer.next(status);
                console.log('received doctor status '+status );
            });
        });
        return observable;
    }

    receiveNotifiedUsers(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-notification', (notify: any) => {
                observer.next(notify);
            });
        });
        return observable;
    }

    //whenever a user or doctor added to the consutation group
    userAdded(user: UserDetails, noitification: Notification) {
        this.socket.emit('user-added', user, noitification);
    }

    receiveUserAdded(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-user-added', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    //whenever a user or doctor removed from the consutation group
    endConsultation(user: UserDetails, group: Group) {
        this.socket.emit('end-consultation', user, group);
    }

    receiveEndConsultation(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-end-consultation', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    consultNotification(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('consult-notification', (data: any) => {
                observer.next(data);
            });
        });
        return observable;
    }

    logout(userId: number): void {
        this.socket.emit('user-disconnect', userId);
    }

    typingListener(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-typing', (data:any) => {
                observer.next(data);
            });
        });
        // return () => {
        //     this.socket.disconnect();
        // };
        return observable;
    }

    /**
     * all media files receive event
     */
    mediaReceive(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('media-file', (data: any) => {
                console.log('media: ' + JSON.stringify(data));
                observer.next(data);
            });
        });
        return observable;
    }

    typingEmitter(groupId: any, userName: any, prescription:Boolean) {
        this.socket.emit('send-typing', groupId, userName, prescription);
    }

    emitCountSync(userId:number, count:number) {
        this.socket.emit('count-sync', userId, count);
    }

    receiveCountSync() {
        const observable = new Observable(observer => {
            this.socket.on('receive-count-sync', (data:any) => {
                observer.next(data);
            });
        });
        return observable;
    }

}
