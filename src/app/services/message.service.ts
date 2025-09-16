import { Injectable } from '@angular/core';
import { Chat } from './chats.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Message {
  body: string;
  chatId: number;
  fromMe: boolean;
  createdAt: Date;
  updatedAt?: Date;
  chat: Chat
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private apiUrl = 'http://localhost:3333';
  private socket!: Socket

  constructor(private http: HttpClient) { }

  connet(userId: number) {
    this.socket = io(this.apiUrl, {
      query: { userId }
    });
  }

  createMessage(body: string, chatId: number): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/message`, { body, chatId })
  }

  // onMessage(): Observable<Message> {
  //   return new Observable(observer => {
  //     this.socket.on('message', (msg: Message) => {
  //       observer.next(msg);
  //     });
  //   });
  // }

  disconnet() {
    if (this.socket) this.socket.disconnect();
  }
}
