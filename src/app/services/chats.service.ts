import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private http: HttpClient) {}

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
