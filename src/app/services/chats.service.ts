import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

export interface Chat {
  id: number;
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
  private showNewChat = new Subject<Chat>();

  constructor(private http: HttpClient, private authService: AuthService) {
    const userId = this.getCurrentUserId();
    if (userId) {
      this.authService.socket!.emit('register_user', userId);
    }

    this.authService.socket!.on('show_new_chat', (showNewChat: Chat) => {
      this.showNewChat.next(showNewChat);
    });
  }

  private getCurrentUserId(): number | null {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return user.user?.id || null;
  }

  joinChat(chatId: number) {
    this.authService.socket!.emit('join_chat', chatId);
  }

  leaveChat(chatId: number) {
    this.authService.socket!.emit('leave_chat', chatId);
  }

  newChat(): Observable<Chat> {
    return this.showNewChat.asObservable();
  }

  createChat(ownerId: number, email: string): Observable<Chat> {
    return this.http.post<Chat>(`${this.apiUrl}/chat`, { ownerId, email });
  }

  getChats(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/chats/${userId}`);
  }

  showChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(`${this.apiUrl}/chat/${id}`);
  }

  updateChat(id: number, chat: Chat): Observable<Chat> {
    return this.http.put<Chat>(`${this.apiUrl}/chat/${id}`, chat);
  }

  deleteChat(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/chat/${id}`);
  }
}
