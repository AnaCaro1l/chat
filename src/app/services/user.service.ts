import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3333';

  constructor(private http: HttpClient) {}

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/user`, user);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user`);
  }

  showUser(id: number): Observable<User> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser.token;
    return this.http.get<User>(`${this.apiUrl}/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateUser(id: number, user: User): Observable<User> {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const token = currentUser.token;
    return this.http.put<User>(`${this.apiUrl}/user/${id}`, user, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/user/${id}`);
  }

  login(email: string, password: string) {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password });
  }
}
