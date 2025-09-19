import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface Chat {
  id?: number;
  ownerId: number;
  recipientId: number;
  createdAt?: Date;
  updatedAt?: Date;
  messages?: any[];
  lastMessage?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private apiUrl = 'http://localhost:3333';
  private socket: Socket;
  private lastMessageSubject = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.socket = io(this.apiUrl);

    this.socket.on('last_message', (lastMessage: string) => {
      this.lastMessageSubject.next(lastMessage)
    })
  }

  onLastMessage(): Observable<string> {
    return this.lastMessageSubject.asObservable();
  }

  createChat(ownerId: number, email: string): Observable<Chat> {
    return this.http.post<Chat>(
      `${this.apiUrl}/chat`,
      { ownerId, email },
    );
  }

  getChats(userId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/chats/${userId}`,
    );
  }

  showChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(
      `${this.apiUrl}/chat/${id}`,
    );
  }

  updateChat(id: number, chat: Chat): Observable<Chat> {
    return this.http.put<Chat>(
      `${this.apiUrl}/chat/${id}`,
      chat,
    );
  }

  deleteChat(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/chat/${id}`,
    );
  }
}
