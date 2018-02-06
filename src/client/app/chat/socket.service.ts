import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import { Message } from '../shared/database/message';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {
    private socket: any;
    private baseUrl = 'http://localhost:3000';

    /**
     * connection
     */
    connection(userId: number) {
        this.socket = io(`${this.baseUrl}`, { query: `userId=${userId}` });
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
}
