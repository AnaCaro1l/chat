import { Injectable } from '@angular/core';
import { Chat } from './chats.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Message {
  id: number;
  body: string;
  chatId: number;
  createdAt: Date;
  updatedAt?: Date;
  chat: Chat;
  fromMe: boolean;
}

interface LastMessagePayload {
  chatId: number;
  body: string;
}

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private apiUrl = 'http://localhost:3333';
  private socket: Socket;
  private messageSubject = new Subject<Message>();
  private lastMessageSubject = new Subject<LastMessagePayload>();

  constructor(private http: HttpClient) {
    this.socket = io(this.apiUrl);

    this.socket.on('message', (msg) => {
      this.messageSubject.next(msg);
    });
    this.socket.on('last_message', (payload: LastMessagePayload) =>
      this.lastMessageSubject.next(payload)
    );
  }

  onLastMessage(): Observable<LastMessagePayload> {
    return this.lastMessageSubject.asObservable();
  }

  onMessage(): Observable<Message> {
    return this.messageSubject.asObservable();
  }

  joinChat(chatId: number) {
    this.socket.emit('join_chat', chatId);
  }

  leaveChat(chatId: number) {
    this.socket.emit('leave_chat', chatId);
  }

  createMessage(body: string, chatId: number): Observable<Message> {
    return this.http.post<Message>(`${this.apiUrl}/message`, { body, chatId });
  }

  listMessages(
    chatId: number,
    page: number = 0,
    pageSize: number = 20
  ): Observable<Message[]> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<Message[]>(`${this.apiUrl}/messages/${chatId}`, {
      params,
    });
  }

  updateMessage(id: number, body: string): Observable<Message> {
    return this.http.put<Message>(`${this.apiUrl}/message`, { id, body });
  }

  deleteMessage(id: number): Observable<Message> {
    return this.http.delete<Message>(`${this.apiUrl}/message/${id}`);
  }
}
