import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Chat {
  id?: number;
  ownerId: number;
  recipientId: number;
  createdAt?: Date;
  updatedAt?: Date;
  messages?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  private apiUrl = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): { headers: HttpHeaders } {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser.token;
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }

  createChat(ownerId: number, email: string): Observable<Chat> {
    return this.http.post<Chat>(
      `${this.apiUrl}/chat`,
      { ownerId, email },
      this.getAuthHeaders()
    );
  }

  getChats(userId: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/chats/${userId}`,
      this.getAuthHeaders()
    );
  }

  showChat(id: number): Observable<Chat> {
    return this.http.get<Chat>(
      `${this.apiUrl}/chat/${id}`,
      this.getAuthHeaders()
    );
  }

  updateChat(id: number, chat: Chat): Observable<Chat> {
    return this.http.put<Chat>(
      `${this.apiUrl}/chat/${id}`,
      chat,
      this.getAuthHeaders()
    );
  }

  deleteChat(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/chat/${id}`,
      this.getAuthHeaders()
    );
  }
}
