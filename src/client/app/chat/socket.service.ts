import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import * as io from 'socket.io-client';

import { Message } from '../shared/database/message';
import { SecurityService } from '../shared/services/security.service';

@Injectable()
export class SocketService {
    private socket: any;
    private baseUrl = 'http://localhost:3000';

    constructor(private securityService: SecurityService) {}

    /**
     * connection
     */
    connection(userId: number) {
        const token = this.securityService.getToken().Authorization;
        this.socket = io(`${this.baseUrl}`, { 
            query: {token: token},
            secure: true
        });
        this.socket.on('connect', () => {
            this.socket.emit('user-connected', userId);
        });
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

    logout(userId: number): void {
        this.socket.emit('user-logout', userId);
    }
}
