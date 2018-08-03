import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Message } from '../shared/database/message';
import { SecurityService } from '../shared/services/security.service';

@Injectable()
export class SocketService {
    private socket: any;
    private baseUrl = 'http://localhost:3000';

    constructor(
        private securityService: SecurityService
    ) {}

    /**
     * connection
     */
    connection(userId: number) {
        const token = this.securityService.getCookie('token');
        this.socket = io(`${this.baseUrl}`, {
            query: {token: token},
            secure: true
        });
        this.socket.on('connect', () => {
            this.socket.emit('user-connected', userId);
        });
    }

    receivedGroupStatus(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('received-group-status', (groupStatus: any) => {
                observer.next(groupStatus);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    sendMessage(message: Message) {
        this.socket.emit('send-message', message);
    }

    receiveMessages(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-message', (data: any) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    updateMessage(message: Message): void {
        this.socket.emit('update-message', message);
    }

    receiveUpdatedMessage(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('updated-message', (message: Message) => {
                observer.next(message);
            });
            return () => {
                this.socket.disconnect();
            };
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
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    notifyUsers(message : Message): void {
       this.socket.emit('notify-users', message);
    }

    receiveNotifiedUsers(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-notification', (notify: any) => {
                observer.next(notify);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    logout(userId: number): void {
        this.socket.emit('user-disconnect', userId);
    }
}
