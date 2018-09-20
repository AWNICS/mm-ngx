import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { Message } from '../shared/database/message';
import { SecurityService } from '../shared/services/security.service';
import { Group } from '../shared/database/group';
import { UserDetails } from '../shared/database/user-details';

@Injectable()
export class SocketService {
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
        const token = this.securityService.getCookie('token');
        this.socket = io(`${this.baseUrl}`, {
            query: { token: token },
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

    sendMessage(message: Message, group: Group) {
        this.socket.emit('send-message', message, group);
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

    notifyUsers(message: Message): void {
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

    //whenever a user or doctor added to the consutation group
    userAdded(user: UserDetails, groupId: number) {
        this.socket.emit('user-added', user, groupId);
    }

    receiveUserAdded(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-user-added', (data: any) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    //whenever a user or doctor removed from the consutation group
    userDeleted(user: UserDetails, group: Group) {
        this.socket.emit('user-deleted', user, group);
    }

    receiveUserDeleted(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-user-deleted', (data: any) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    consultNotification(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('consult-notification', (data: any) => {
                observer.next(data);
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

    typingListener(): Observable<any> {
        const observable = new Observable(observer => {
            this.socket.on('receive-typing', (data:any) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        });
        return observable;
    }

    typingEmitter(groupId: any, userName: any) {
        this.socket.emit('send-typing', groupId, userName);
    }
}
