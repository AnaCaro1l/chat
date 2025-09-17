import { Injectable } from '@angular/core';
import { Chat } from './chats.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Message {
  body: string;
  chatId: number;
  createdAt: Date;
  updatedAt?: Date;
  chat: Chat;
  fromMe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  private apiUrl = 'http://localhost:3333';
  private socket: Socket;
  private messageSubject = new Subject<Message>();

  constructor(private http: HttpClient) { 
    this.socket = io(this.apiUrl);

    this.socket.on('message', (msg) => {
      console.log('Mensagem recebida via socket', msg)
      this.messageSubject.next(msg);
    })
  }


  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }
   
  createMessage(body: string, chatId: number): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/message`, { body, chatId })
  }

}
